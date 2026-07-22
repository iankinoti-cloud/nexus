import type { Enquiry } from '../data/types';

export function exportProposalPDF(enquiry: Enquiry) {
  const { proposal, quotation, companyName, contactName, contactEmail } = enquiry;
  if (!proposal || !quotation) return;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: quotation.currency || 'USD', maximumFractionDigits: 0 }).format(n);

  const sectionsHtml = proposal.sections
    .map(s => `<div class="section"><h3>${s.title}</h3><p>${s.body.replace(/\n/g, '<br>')}</p></div>`)
    .join('');

  const deliverablesHtml = proposal.deliverables
    .map(d => `<li>${d}</li>`)
    .join('');

  const lineItemsHtml = quotation.lineItems
    .map(item => `
      <tr>
        <td>${item.description}</td>
        <td class="num">${item.quantity}</td>
        <td class="num">${item.unit}</td>
        <td class="num">${fmt(item.rate)}</td>
        <td class="num bold">${fmt(item.total)}</td>
      </tr>`)
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${proposal.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', -apple-system, sans-serif; color: #0B0B0F; background: #fff; font-size: 13px; line-height: 1.6; }
  .page { max-width: 800px; margin: 0 auto; padding: 60px 56px; }

  /* Cover */
  .cover { min-height: 280px; background: #0B0B0F; color: #fff; padding: 56px; margin: -60px -56px 56px; display: flex; flex-direction: column; justify-content: flex-end; }
  .cover-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 24px; }
  .cover h1 { font-size: 28px; font-weight: 600; line-height: 1.25; color: #fff; margin-bottom: 8px; }
  .cover-sub { color: rgba(255,255,255,0.5); font-size: 13px; }
  .cover-meta { display: flex; gap: 32px; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }
  .cover-meta-item { font-size: 11px; color: rgba(255,255,255,0.45); }
  .cover-meta-item strong { display: block; color: rgba(255,255,255,0.85); font-size: 13px; margin-bottom: 2px; }

  /* Accent bar */
  .accent { display: inline-block; width: 32px; height: 3px; background: #C084FC; border-radius: 2px; margin-bottom: 12px; }

  /* Headings */
  h2 { font-size: 18px; font-weight: 600; color: #0B0B0F; margin-bottom: 16px; margin-top: 40px; }
  h3 { font-size: 13px; font-weight: 600; color: #0B0B0F; margin-bottom: 8px; }
  p { color: #3D3D4A; margin-bottom: 12px; }

  /* Sections */
  .section { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #F0F0F4; }
  .section:last-child { border-bottom: none; }

  /* Executive summary */
  .exec-summary { background: #F7F7FA; border-left: 3px solid #C084FC; padding: 20px 24px; border-radius: 0 8px 8px 0; margin-bottom: 32px; }
  .exec-summary p { color: #2A2A35; margin: 0; white-space: pre-line; }

  /* Deliverables */
  ul { padding-left: 20px; color: #3D3D4A; }
  ul li { margin-bottom: 6px; }

  /* Timeline */
  .timeline-badge { display: inline-block; background: rgba(192,132,252,0.1); border: 1px solid rgba(192,132,252,0.3); color: #7C3AED; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; }

  /* Quotation table */
  .quote-section { margin-top: 48px; padding-top: 40px; border-top: 2px solid #0B0B0F; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  thead th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; padding: 0 12px 10px; text-align: left; border-bottom: 1px solid #E5E5EA; }
  thead th.num { text-align: right; }
  tbody td { padding: 11px 12px; border-bottom: 1px solid #F0F0F4; color: #2A2A35; vertical-align: top; }
  td.num { text-align: right; }
  td.bold { font-weight: 600; }

  /* Totals */
  .totals { margin-top: 8px; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
  .total-row { display: flex; gap: 48px; font-size: 12px; color: #666; }
  .total-final { display: flex; gap: 48px; font-size: 18px; font-weight: 700; color: #0B0B0F; margin-top: 8px; padding-top: 12px; border-top: 2px solid #0B0B0F; }

  /* Footer */
  .footer { margin-top: 56px; padding-top: 24px; border-top: 1px solid #E5E5EA; display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }
  .notes { background: #FAFAFA; border: 1px solid #E5E5EA; border-radius: 8px; padding: 16px 20px; margin-top: 24px; font-size: 11px; color: #666; line-height: 1.7; }

  @media print {
    body { font-size: 12px; }
    .page { padding: 0; }
    .cover { margin: 0 0 48px; border-radius: 0; }
    h2 { page-break-after: avoid; }
    .section { page-break-inside: avoid; }
    .quote-section { page-break-before: always; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="cover">
    <div class="cover-label">NEXUS · Creative Partnership Proposal</div>
    <h1>${proposal.title}</h1>
    <div class="cover-sub">Prepared for ${contactName} · ${companyName}</div>
    <div class="cover-meta">
      <div class="cover-meta-item"><strong>${contactEmail}</strong>Contact</div>
      <div class="cover-meta-item"><strong>${proposal.timeline}</strong>Timeline</div>
      <div class="cover-meta-item"><strong>Valid until ${quotation.validUntil}</strong>Quotation</div>
      <div class="cover-meta-item"><strong>${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>Date</div>
    </div>
  </div>

  <div class="accent"></div>
  <h2>Executive Summary</h2>
  <div class="exec-summary"><p>${proposal.executiveSummary}</p></div>

  <h2>Our Approach</h2>
  ${sectionsHtml}

  <h2>Deliverables</h2>
  <ul>${deliverablesHtml}</ul>

  <div style="margin-top:28px">
    <span class="timeline-badge">⏱ ${proposal.timeline}</span>
  </div>

  ${proposal.teamNotes ? `<div class="section" style="margin-top:32px"><h3>Team</h3><p>${proposal.teamNotes}</p></div>` : ''}

  <div class="quote-section">
    <div class="accent"></div>
    <h2>Quotation</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="num">Qty</th>
          <th class="num">Unit</th>
          <th class="num">Rate</th>
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>${lineItemsHtml}</tbody>
    </table>
    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>${fmt(quotation.subtotal)}</span></div>
      ${quotation.tax > 0 ? `<div class="total-row"><span>Tax (${quotation.tax}%)</span><span>${fmt(quotation.total - quotation.subtotal)}</span></div>` : ''}
      <div class="total-final"><span>Total</span><span>${fmt(quotation.total)}</span></div>
    </div>
    <div class="notes">${quotation.notes}</div>
  </div>

  <div class="footer">
    <span>NEXUS · ${companyName} Proposal</span>
    <span>Confidential — prepared ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
  </div>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
