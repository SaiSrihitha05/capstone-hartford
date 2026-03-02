using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Application.DTOs
{
    public class PlanResponseDto
    {
        public int Id { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BaseRate { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public decimal MinCoverageAmount { get; set; }
        public decimal MaxCoverageAmount { get; set; }
        public int MinTermYears { get; set; }
        public int MaxTermYears { get; set; }
        public int MinNominees { get; set; }
        public int MaxNominees { get; set; }
        public int GracePeriodDays { get; set; }
        public bool HasMaturityBenefit { get; set; }
        public bool IsReturnOfPremium { get; set; }
        public int MaxPolicyMembersAllowed { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public decimal CommissionRate { get; set; }
    }
}