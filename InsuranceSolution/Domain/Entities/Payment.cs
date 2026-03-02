using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }

        public int PolicyAssignmentId { get; set; }

        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }

        public string PaymentMethod { get; set; } = string.Empty;
        public string TransactionReference { get; set; } = string.Empty;
        public int InstallmentsPaid { get; set; } = 1;
        public PaymentStatus Status { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public PolicyAssignment? PolicyAssignment { get; set; }
    }
}
