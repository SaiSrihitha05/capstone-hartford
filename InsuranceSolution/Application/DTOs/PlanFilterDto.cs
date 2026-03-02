using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class PlanFilterDto
    {
        public string? PlanType { get; set; }
        public int? Age { get; set; }                        // filters plans where MinAge <= Age <= MaxAge
        public decimal? CoverageAmount { get; set; }         // filters plans where Min <= Amount <= Max
        public int? TermYears { get; set; }                  // filters plans where MinTerm <= Years <= MaxTerm
        public bool? HasMaturityBenefit { get; set; }
        public bool? IsReturnOfPremium { get; set; }
    }
}

