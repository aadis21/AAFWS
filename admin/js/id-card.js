/**
 * AAFWS Admin ID Card Renderer & Downloader
 */

// Global function to render ID Card preview
function renderIDCard(member) {
  // Set Front Details
  const frontPhoto = document.getElementById('id-card-front-photo');
  if (frontPhoto) {
    frontPhoto.src = member.profileImage || '../uploads/profile-images/default-avatar.png';
    frontPhoto.onerror = function() {
      this.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // default fallback image
    };
  }

  const nameVal = document.getElementById('id-card-front-name');
  if (nameVal) nameVal.textContent = member.fullName || 'N/A';

  const typeVal = document.getElementById('id-card-front-role');
  if (typeVal) typeVal.textContent = member.memberType || 'MEMBERSHIP';

  const idVal = document.getElementById('id-card-front-id');
  if (idVal) idVal.textContent = member.membershipId || 'PENDING';

  const phoneVal = document.getElementById('id-card-front-phone');
  if (phoneVal) phoneVal.textContent = member.phone || 'N/A';

  const bloodVal = document.getElementById('id-card-front-blood');
  if (bloodVal) bloodVal.textContent = member.bloodGroup || 'N/A';

  const stateVal = document.getElementById('id-card-front-state');
  if (stateVal) stateVal.textContent = member.state || 'N/A';

  // Set Back Details
  const backQr = document.getElementById('id-card-back-qr');
  if (backQr && member._id) {
    const token = localStorage.getItem('admin_token');
    // Fetch QR stream directly from authenticated endpoint by setting source
    // Since it's protected, we can load it by performing fetch, converting blob to URL
    fetch(`/api/admin/idcard/${member._id}/qr`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to load QR');
      return response.blob();
    })
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      backQr.src = objectURL;
    })
    .catch(err => {
      console.error('QR Load Error:', err);
      backQr.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; // fallback qr code
    });
  }

  const backName = document.getElementById('id-card-back-name');
  if (backName) backName.textContent = member.fullName || 'N/A';

  const backDob = document.getElementById('id-card-back-dob');
  if (backDob) backDob.textContent = member.dob || 'N/A';

  const backBar = document.getElementById('id-card-back-bar');
  if (backBar) backBar.textContent = member.barCouncilNo || 'N/A';

  const backEnroll = document.getElementById('id-card-back-enroll');
  if (backEnroll) backEnroll.textContent = member.enrollmentYear || 'N/A';

  const backEmergency = document.getElementById('id-card-back-emergency');
  if (backEmergency) backEmergency.textContent = member.emergencyContact || 'N/A';
}

// Download ID card as PNG image
async function downloadCardAsPNG(cardElementId, fileName) {
  const cardElement = document.getElementById(cardElementId);
  if (!cardElement) {
    showToast('Card element not found.', 'error');
    return;
  }

  try {
    showToast('Generating PNG. Please wait...', 'info');
    
    // Use html2canvas to render DOM node to canvas
    const canvas = await html2canvas(cardElement, {
      scale: 3, // Increase scale for higher quality print
      useCORS: true, // Allow cross-origin images
      backgroundColor: null
    });

    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('PNG downloaded successfully.', 'success');
  } catch (error) {
    console.error('PNG Export Error:', error);
    showToast('Failed to generate PNG.', 'error');
  }
}

// Download ID Card as PDF (Both front and back)
async function downloadCardAsPDF(member) {
  const frontElement = document.getElementById('id-card-front-view');
  const backElement = document.getElementById('id-card-back-view');

  if (!frontElement || !backElement) {
    showToast('Card elements not found.', 'error');
    return;
  }

  try {
    showToast('Generating PDF. Please wait...', 'info');

    // Render front and back views to canvas
    const frontCanvas = await html2canvas(frontElement, { scale: 3, useCORS: true });
    const backCanvas = await html2canvas(backElement, { scale: 3, useCORS: true });

    const frontImgData = frontCanvas.toDataURL('image/png');
    const backImgData = backCanvas.toDataURL('image/png');

    // Create PDF page in Portrait format
    // jsPDF parameters: orientation, unit, format
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Card sizes in mm (approx standard CR80 size scaled cleanly: 54mm x 86mm, or scaled up for A4 page)
    const cardWidth = 54;
    const cardHeight = 85;

    // Centering calculations
    const pageWidth = pdf.internal.pageSize.getWidth();
    const xPos = (pageWidth - cardWidth) / 2;

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(11, 25, 44); // Primary navy color
    pdf.text('AAFWS Membership ID Card', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Member Name: ${member.fullName}`, pageWidth / 2, 26, { align: 'center' });
    pdf.text(`Membership ID: ${member.membershipId || 'Pending'}`, pageWidth / 2, 31, { align: 'center' });

    // Draw Front Card
    pdf.text('Front Side', pageWidth / 2, 42, { align: 'center' });
    pdf.addImage(frontImgData, 'PNG', xPos, 45, cardWidth, cardHeight);

    // Draw Back Card
    pdf.text('Back Side', pageWidth / 2, 147, { align: 'center' });
    pdf.addImage(backImgData, 'PNG', xPos, 150, cardWidth, cardHeight);

    // Footer note
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by All India Advocate Federation & Welfare Association (AAFWS)', pageWidth / 2, 275, { align: 'center' });

    pdf.save(`ID-Card-${member.membershipId || 'Member'}.pdf`);
    showToast('PDF generated successfully.', 'success');
  } catch (error) {
    console.error('PDF Export Error:', error);
    showToast('Failed to generate PDF.', 'error');
  }
}
