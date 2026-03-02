using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Document
    {
        public int Id { get; set; }

        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string DocumentCategory { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }

        public int UploadedByUserId { get; set; }

        public int? PolicyAssignmentId { get; set; }
        public int? ClaimId { get; set; }

        public User? UploadedByUser { get; set; }
        public PolicyAssignment? PolicyAssignment { get; set; }
        public InsuranceClaim? Claim { get; set; }
    }
}
