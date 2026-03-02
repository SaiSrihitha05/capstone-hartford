using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class CreatePlanDto
    {
        [Required]
        public string PlanName { get; set; } = string.Empty;

        [Required]
        public string PlanType { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "BaseRate must be greater than 0")]
        public decimal BaseRate { get; set; }

        [Range(0, 150)]
        public int MinAge { get; set; }

        [Range(0, 150)]
        public int MaxAge { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal MinCoverageAmount { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal MaxCoverageAmount { get; set; }

        [Range(1, 50)]
        public int MinTermYears { get; set; }

        [Range(1, 50)]
        public int MaxTermYears { get; set; }
        [Range(1, 10)]
        public int MinNominees { get; set; } = 1;

        [Range(1, 10)]
        public int MaxNominees { get; set; } = 5;

        [Range(0, 365)]
        public int GracePeriodDays { get; set; }

        public bool HasMaturityBenefit { get; set; }
        public bool IsReturnOfPremium { get; set; }

        [Range(1, 20)]
        public int MaxPolicyMembersAllowed { get; set; }

        [Range(0, 100, ErrorMessage = "Commission rate must be between 0 and 100")]
        public decimal CommissionRate { get; set; }
    }
}

