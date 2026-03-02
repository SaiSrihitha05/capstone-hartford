using Domain.Enums;

namespace Domain.Entities
{
    public class InsuranceClaim        // ← renamed from Claim to avoid conflict
    {
        public int Id { get; set; }
        public int PolicyAssignmentId { get; set; }
        public int PolicyMemberId { get; set; }        // the deceased member
        public int? ClaimsOfficerId { get; set; }      // nullable until assigned
        public ClaimType ClaimType { get; set; }
        public decimal ClaimAmount { get; set; }       // coverage of that member
        public string NomineeName { get; set; } = string.Empty;  // who filed
        public string NomineeContact { get; set; } = string.Empty;
        public string? DeathCertificateNumber { get; set; }      // for death claims
        public DateTime FiledDate { get; set; }
        public ClaimStatus Status { get; set; }
        public string? Remarks { get; set; }
        public decimal? SettlementAmount { get; set; }  // actual amount paid
        public DateTime? ProcessedDate { get; set; }
        public DateTime CreatedAt { get; set; }

        public PolicyAssignment? PolicyAssignment { get; set; }
        public PolicyMember? PolicyMember { get; set; }
        public User? ClaimsOfficer { get; set; }
        public ICollection<Document> Documents { get; set; }
            = new List<Document>();
    }
}