using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class PolicyAssignment
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public int? AgentId { get; set; }
        public int PlanId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public PolicyStatus Status { get; set; }

        public decimal TotalPremiumAmount { get; set; }

        public PremiumFrequency PremiumFrequency { get; set; }
        public DateTime NextDueDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? AssignedDate { get; set; }

        public User? Customer { get; set; }
        public User? Agent { get; set; }
        public Plan? Plan { get; set; }
        public int TermYears { get; set; }

        //navigation collections
        public ICollection<PolicyMember> PolicyMembers { get; set; }
    = new List<PolicyMember>();
        public ICollection<PolicyNominee> PolicyNominees { get; set; }
            = new List<PolicyNominee>();
        public ICollection<Document> Documents { get; set; }
            = new List<Document>();
    }
}
