using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class PolicyNominee
    {
        public int Id { get; set; }
        public int PolicyAssignmentId { get; set; }

        public string NomineeName { get; set; } = string.Empty;
        public string RelationshipToPolicyHolder { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;

        public decimal SharePercentage { get; set; }

        public DateTime CreatedAt { get; set; }

        public PolicyAssignment? PolicyAssignment { get; set; }
    }
}
