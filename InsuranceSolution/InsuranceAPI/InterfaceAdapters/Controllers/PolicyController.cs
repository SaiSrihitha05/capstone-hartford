using Application.DTOs;
using Application.Exceptions;
using Application.Services;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace InsuranceAPI.InterfaceAdapters.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PoliciesController : ControllerBase
    {
        private readonly IPolicyService _policyService;

        public PoliciesController(IPolicyService policyService)
        {
            _policyService = policyService;
        }

        //  Customer 
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreatePolicy([FromForm] CreatePolicyDto dto)
        {
            var memberList = JsonSerializer.Deserialize<List<PolicyMemberDto>>(
                dto.Members,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            var nomineeList = JsonSerializer.Deserialize<List<PolicyNomineeDto>>(
                dto.Nominees,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (memberList == null || !memberList.Any())
                throw new BadRequestException("At least one policy member is required");

            if (nomineeList == null || !nomineeList.Any())
                throw new BadRequestException("At least one nominee is required");

            if (dto.IdentityProof == null)
                throw new BadRequestException("Customer identity proof is required");

            if (dto.IncomeProof == null)
                throw new BadRequestException("Customer income proof is required");

            var nonPrimaryMembers = memberList.Where(m => !m.IsPrimaryInsured).ToList();
            if (nonPrimaryMembers.Any() &&
                (dto.MemberDocuments == null || !dto.MemberDocuments.Any()))
                throw new BadRequestException(
                    "Identity proof required for all non-primary members");

            var customerDocs = new List<IFormFile>
    {
        dto.IdentityProof,
        dto.IncomeProof
    };

            var customerId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _policyService.CreatePolicyAsync(
                customerId,
                dto,
                memberList,
                nomineeList,
                customerDocs,
                dto.MemberDocuments ?? new List<IFormFile>());

            return CreatedAtAction(
                nameof(GetPolicyById), new { id = result.Id }, result);
        }
        [HttpGet("my-policies")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyPolicies()
        {
            var customerId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _policyService.GetMyPoliciesAsync(customerId);
            return Ok(result);
        }

        //  Agent 

        [HttpGet("my-assigned-policies")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> GetAgentPolicies()
        {
            var agentId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _policyService.GetAgentPoliciesAsync(agentId);
            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> UpdatePolicyStatus(
            int id, [FromBody] UpdatePolicyStatusDto dto)
        {
            await _policyService.UpdatePolicyStatusAsync(id, dto);
            return Ok(new { message = "Policy status updated successfully" });
        }

        //  Admin 

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllPolicies()
        {
            var result = await _policyService.GetAllPoliciesAsync();
            return Ok(result);
        }

        [HttpPatch("{id}/assign-agent")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignAgent(
            int id, [FromBody] AssignAgentDto dto)
        {
            await _policyService.AssignAgentAsync(id, dto);
            return Ok(new { message = "Agent assigned successfully" });
        }

        //  Admin + Agent + Customer 

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Agent,Customer")]
        public async Task<IActionResult> GetPolicyById(int id)
        {
            var result = await _policyService.GetPolicyByIdAsync(id);
            return Ok(result);
        }
        [HttpGet("download-document/{documentId}")]
        [Authorize(Roles = "Admin,Customer,Agent,ClaimsOfficer")]
        public async Task<IActionResult> DownloadDocument(int documentId)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            var (fileBytes, fileName, contentType) =
                await _policyService.DownloadDocumentAsync(documentId, userId, role);

            return File(fileBytes, contentType, fileName);
        }
    }
}