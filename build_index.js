const fs = require('fs');
const path = require('path');

const DIR = 'd:\\styleAnalytics';

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function extractComponentHtml(htmlContent) {
    // Tìm nội dung bên trong <body>...</body>, bỏ qua các thẻ <script>
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let inner = bodyMatch ? bodyMatch[1] : htmlContent;

    // Bỏ tất cả thẻ <script...>...</script>
    inner = inner.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Trim dòng trống đầu và cuối
    const lines = inner.split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

    return lines.join('\n');
}

// Cấu hình các category và component
const categories = [
    {
        id: 'tab-accordion',
        btnId: 'tab-accordion-btn',
        title: '1. Accordion Components',
        desc: 'Các mẫu Accordion mở rộng / thu gọn (Collapse) trong hệ thống Google Analytics',
        icon: 'bi-menu-button-wide text-primary',
        active: true,
        items: [
            {
                sampleId: 'acc-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Tasks Accordion (Bắt đầu nhiệm vụ Google Analytics)',
                htmlFile: 'accordion1.html',
                cssFile: 'accordion1.css',
                jsFile: null,
                previewId: 'preview-accordion1',
                previewClass: 'p-4',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Chứa cả Popper) (Đặt trước thẻ đóng </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý quan trọng cho Dev:</strong> Tính năng đóng mở phụ thuộc trực tiếp vào thuộc tính <code>data-bs-toggle="collapse"</code> của <strong>Bootstrap JS Bundle</strong>. Khi nhúng cần đảm bảo có file <code>bootstrap.bundle.min.js</code>.`
            }
        ]
    },
    {
        id: 'tab-cards',
        btnId: 'tab-cards-btn',
        title: '2. Card Components',
        desc: 'Các mẫu Thẻ (Card) giới thiệu tính năng, báo cáo và tiến độ trong Analytics',
        icon: 'bi-card-heading text-warning',
        active: false,
        items: [
            {
                sampleId: 'card-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Promo Card (Thẻ quảng bá tài khoản minh họa & thư viện mẫu dạng cuộn)',
                htmlFile: 'card1.html',
                cssFile: 'card1.css',
                jsFile: null,
                previewId: 'preview-card1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Component sử dụng thanh cuộn tùy chỉnh <code>.custom-scrollbar</code> cùng đồ họa vector SVG inline mô phỏng biểu đồ Analytics.`
            },
            {
                sampleId: 'card-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-info text-white',
                title: 'Tasks Banner Card (Thẻ biểu ngữ thông tin tiến độ nhiệm vụ và thanh tiến trình)',
                htmlFile: 'card2.html',
                cssFile: 'card2.css',
                jsFile: null,
                previewId: 'preview-card2',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Thẻ dạng banner responsive, tự động chuyển đổi bố cục flex dạng cột trên màn hình hẹp (dưới 900px).`
            },
            {
                sampleId: 'card-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Chart Card (Thẻ biểu đồ trượt số liệu người dùng & popover điểm dữ liệu)',
                htmlFile: 'card3.html',
                cssFile: 'card3.css',
                jsFile: 'card3.js',
                previewId: 'preview-card3',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ trực quan kèm thanh trượt chọn các chỉ số phân tích (Metrics) và popover hiển thị giá trị khi rê chuột qua các điểm dữ liệu.`
            },
            {
                sampleId: 'card-mau-4',
                badgeText: 'Mẫu 4',
                badgeClass: 'text-bg-success',
                title: 'Analytics Detailed Chart Card (Thẻ biểu đồ đường chi tiết theo thời gian kèm bảng dữ liệu)',
                htmlFile: 'card4.html',
                cssFile: 'card4.css',
                jsFile: 'card4.js',
                previewId: 'preview-card4',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Thẻ phân tích tổng số người dùng theo thời gian với tooltip tương tác trên đường SVG và bảng thống kê chi tiết phía dưới.`
            },
            {
                sampleId: 'card-mau-5',
                badgeText: 'Mẫu 5',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Funnel Chart Card (Thẻ biểu đồ phễu chuyển đổi & tỷ lệ bỏ ngang qua từng bước)',
                htmlFile: 'card5.html',
                cssFile: 'card5.css',
                jsFile: null,
                previewId: 'preview-card5',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ phễu (Funnel) phân tích hành trình khách hàng từ bắt đầu phiên, thêm vào giỏ hàng đến mua hàng với công tắc đóng/mở phễu.`
            },
            {
                sampleId: 'card-mau-6',
                badgeText: 'Mẫu 6',
                badgeClass: 'text-bg-secondary',
                title: 'Analytics Event Table Card (Thẻ bảng sự kiện & thanh tiến trình tỷ lệ theo tên sự kiện)',
                htmlFile: 'card6.html',
                cssFile: 'card6.css',
                jsFile: null,
                previewId: 'preview-card6',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Thẻ hiển thị danh sách các sự kiện theo tên (page_view, scroll, session_start...) với thanh tiến trình trực quan và dropdown kiểm tra dữ liệu.`
            },
            {
                sampleId: 'card-mau-7',
                badgeText: 'Mẫu 7',
                badgeClass: 'text-bg-info text-white',
                title: 'Analytics Dynamic Interactive Chart Card (Thẻ biểu đồ động chuyển đổi tập dữ liệu tương tác)',
                htmlFile: 'card7.html',
                cssFile: 'card7.css',
                jsFile: 'card7.js',
                previewId: 'preview-card7',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ động cho phép chọn tab số liệu (Thời gian tương tác, số phiên...) để tự động vẽ lại đường biểu đồ SVG và dải giá trị tương ứng.`
            },
            {
                sampleId: 'card-mau-8',
                badgeText: 'Mẫu 8',
                badgeClass: 'text-bg-dark',
                title: 'Analytics Detailed Multi-Line Chart Card (Thẻ biểu đồ đa đường phân tích theo Ngày/Tuần/Tháng)',
                htmlFile: 'card8.html',
                cssFile: 'card8.css',
                jsFile: 'card8.js',
                previewId: 'preview-card8',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Biểu đồ đa đường phân tích xu hướng nhiều sự kiện cùng lúc qua thời gian, hỗ trợ chuyển đổi chu kỳ Ngày/Tuần/Tháng linh hoạt.`
            },
            {
                sampleId: 'card-mau-9',
                badgeText: 'Mẫu 9',
                badgeClass: 'text-bg-danger',
                title: 'Analytics Bubble Card (Thẻ phân tích tỷ lệ người dùng mới dạng bong bóng trực quan)',
                htmlFile: 'card9.html',
                cssFile: 'card9.css',
                jsFile: null,
                previewId: 'preview-card9',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Thẻ hiển thị phân bố người dùng mới theo nền tảng dạng bong bóng tròn ấn tượng kèm tỷ lệ phần trăm chi tiết.`
            }
        ]
    },
    {
        id: 'tab-carousel',
        btnId: 'tab-carousel-btn',
        title: '3. Carousel Components',
        desc: 'Mẫu danh sách bộ sưu tập thẻ báo cáo trượt ngang mượt mà (Horizontal Slider)',
        icon: 'bi-images text-info',
        active: false,
        items: [
            {
                sampleId: 'carousel-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-info text-white',
                title: 'Analytics Carousel Collection (Bộ sưu tập báo cáo trượt ngang)',
                htmlFile: 'carousel1.html',
                cssFile: 'carousel1.css',
                jsFile: 'carousel1.js',
                previewId: 'preview-carousel1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Component cần script <code>carousel1.js</code> để tính toán khoảng trượt và kích hoạt ẩn/hiện nút Next/Prev.`
            },
            {
                sampleId: 'carousel-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Exploration Carousel (Băng chuyền danh sách các mẫu bản khám phá dữ liệu)',
                htmlFile: 'carousel2.html',
                cssFile: 'carousel2.css',
                jsFile: 'carousel2.js',
                previewId: 'preview-carousel2',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Component cần script <code>carousel2.js</code> để điều hướng thanh trượt bản khám phá, tính toán độ rộng thẻ và vô hiệu hóa nút Prev/Next khi tới biên.`
            },
            {
                sampleId: 'carousel-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-success',
                title: 'Analytics Recent Carousel (Băng chuyền các báo cáo và hoạt động xem gần đây)',
                htmlFile: 'carousel3.html',
                cssFile: 'carousel3.css',
                jsFile: 'carousel3.js',
                previewId: 'preview-carousel3',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Component cần script <code>carousel3.js</code> để cuộn ngang qua các mục báo cáo xem gần đây.`
            }
        ]
    },
    {
        id: 'tab-dropdowns',
        btnId: 'tab-dropdowns-btn',
        title: '4. Dropdown Components',
        desc: 'Các menu thả xuống cho Apps Launcher và Quản lý tài khoản cá nhân',
        icon: 'bi-menu-button-wide-fill text-danger',
        active: false,
        items: [
            {
                sampleId: 'dropdown-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-danger',
                title: 'Apps Dropdown (Trình khởi chạy Google Marketing Platform 3x3)',
                htmlFile: 'dropdown1.html',
                cssFile: 'dropdown1.css',
                jsFile: null,
                previewId: 'preview-dropdown1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Sử dụng thuộc tính <code>data-bs-auto-close="outside"</code> giúp menu không bị đóng khi click vào nhóm "Khám phá thêm" thu gọn/mở rộng.`
            },
            {
                sampleId: 'dropdown-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-primary',
                title: 'Profile Dropdown (Menu tài khoản cá nhân & chuyển đổi profile)',
                htmlFile: 'dropdown2.html',
                cssFile: 'dropdown2.css',
                jsFile: null,
                previewId: 'preview-dropdown2',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Menu quản lý tài khoản hiển thị avatar màu cùng liên kết chính sách và các thao tác tài khoản nhanh.`
            }
        ]
    },
    {
        id: 'tab-modals',
        btnId: 'tab-modals-btn',
        title: '5. Modal Components',
        desc: 'Hộp thoại chọn tài khoản, thuộc tính và ứng dụng Analytics đa cấp',
        icon: 'bi-window-stack text-primary',
        active: false,
        items: [
            {
                sampleId: 'modal-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-primary',
                title: 'Account Selector Modal (Hộp thoại chọn tài khoản & thuộc tính Analytics)',
                htmlFile: 'modal1.html',
                cssFile: 'modal1.css',
                jsFile: null,
                previewId: 'preview-modal1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Hộp thoại chứa các tab chọn lọc (Tất cả, Ưa thích, Gần đây) và bộ lọc thuộc tính. Click vào nút "Minh Hào" trong bản xem trước để mở Modal.`
            },
            {
                sampleId: 'modal-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Add User Modal (Hộp thoại thêm người dùng, phân quyền vai trò & hạn chế dữ liệu)',
                htmlFile: 'modal2.html',
                cssFile: 'modal2.css',
                jsFile: null,
                previewId: 'preview-modal2',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Hộp thoại phân quyền toàn diện kích thước 90vw x 90vh với đầy đủ danh sách vai trò chuẩn (Quản trị viên, Người chỉnh sửa, Người xem...) và các quy định hạn chế dữ liệu tài sản. Bấm nút trong bản xem trước để mở Modal.`
            }
        ]
    },
    {
        id: 'tab-offcanvas',
        btnId: 'tab-offcanvas-btn',
        title: '6. Offcanvas Components',
        desc: 'Các bảng trượt Offcanvas từ phải qua và từ trên xuống cho tính năng phân tích nâng cao',
        icon: 'bi-layout-sidebar-reverse text-success',
        active: false,
        items: [
            {
                sampleId: 'offcanvas-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-success',
                title: 'Insights Offcanvas (Bảng thông tin chi tiết Analytics Thông minh)',
                htmlFile: 'offcanvas1.html',
                cssFile: 'offcanvas1.css',
                jsFile: null,
                previewId: 'preview-offcanvas1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Bảng trượt từ cạnh phải (offcanvas-end) chứa danh sách câu hỏi thông minh dạng Accordion đa cấp.`
            },
            {
                sampleId: 'offcanvas-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-primary',
                title: 'Notes Offcanvas (Trình xem & tạo chú thích dạng chuyển đổi 2 màn hình)',
                htmlFile: 'offcanvas2.html',
                cssFile: 'offcanvas2.css',
                jsFile: 'offcanvas2.js',
                previewId: 'preview-offcanvas2',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Cần script <code>offcanvas2.js</code> để thực hiện animation trượt mượt mà giữa màn hình xem và form nhập chú thích.`
            },
            {
                sampleId: 'offcanvas-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-info text-white',
                title: 'Compare Offcanvas (Bảng áp dụng phép so sánh dữ liệu từ trên xuống)',
                htmlFile: 'offcanvas3.html',
                cssFile: 'offcanvas3.css',
                jsFile: 'offcanvas3.js',
                previewId: 'preview-offcanvas3',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Cần script <code>offcanvas3.js</code> để quản lý trạng thái chọn checkbox, lọc tìm kiếm bảng và hiển thị các tag pill đã chọn.`
            },
            {
                sampleId: 'offcanvas-mau-4',
                badgeText: 'Mẫu 4',
                badgeClass: 'text-bg-secondary',
                title: 'Analytics Settings Offcanvas (Bảng trượt cấu hình cài đặt phân tích và trực quan hóa)',
                htmlFile: 'offcanvas4.html',
                cssFile: 'offcanvas4.css',
                jsFile: null,
                previewId: 'preview-offcanvas4',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Bảng điều khiển cài đặt trượt từ cạnh phải (Offcanvas End) phục vụ cấu hình biểu mẫu, chọn dạng trực quan và thả phân đoạn so sánh.`
            }
        ]
    },
    {
        id: 'tab-popovers',
        btnId: 'tab-popovers-btn',
        title: '7. Popover Components',
        desc: 'Bảng Popover thả xuống khi kích hoạt ô tìm kiếm thông minh',
        icon: 'bi-chat-square-text-fill text-purple',
        active: false,
        items: [
            {
                sampleId: 'popover-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-dark',
                title: 'Search Popover (Thanh tìm kiếm với gợi ý được xem gần đây & câu hỏi Analytics)',
                htmlFile: 'popover1.html',
                cssFile: 'popover1.css',
                jsFile: 'popover1.js',
                previewId: 'preview-popover1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Cần script <code>popover1.js</code> để lắng nghe sự kiện focus vào ô input và tự động ẩn popover khi người dùng nhấp chuột ra ngoài.`
            },
            {
                sampleId: 'popover-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Help Popover (Menu trợ giúp nhanh, hướng dẫn & gửi phản hồi)',
                htmlFile: 'popover2.html',
                cssFile: 'popover2.css',
                jsFile: null,
                previewId: 'preview-popover2',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Menu trợ giúp nhanh kích hoạt từ icon dấu chấm hỏi với <code>dropdown-menu-end</code> và hiệu ứng bóng đổ đẹp mắt.`
            }
        ]
    },
    {
        id: 'tab-sidebar',
        btnId: 'tab-sidebar-btn',
        title: '8. Sidebar Components',
        desc: 'Các mẫu Sidebar điều hướng chuyên nghiệp (dạng Hover mở rộng và dạng Collapsible Toggle)',
        icon: 'bi-layout-sidebar text-primary',
        active: false,
        items: [
            {
                sampleId: 'sidebar-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Sidebar Hover (Sidebar biểu tượng tự mở rộng khi rê chuột)',
                htmlFile: 'sidebar1.html',
                cssFile: 'sidebar1.css',
                jsFile: 'sidebar1.js',
                previewId: 'preview-sidebar1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Rê chuột vào thanh Sidebar để xem hiệu ứng mở rộng tự nhiên từ 64px thành 240px. Script <code>sidebar1.js</code> quản lý chuyển đổi trạng thái active.`
            },
            {
                sampleId: 'sidebar-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-secondary',
                title: 'Analytics Sidebar Layout (Sidebar đa cấp với nút thu gọn/mở rộng toggle)',
                htmlFile: 'sidebar2.html',
                cssFile: 'sidebar2.css',
                jsFile: 'sidebar2.js',
                previewId: 'preview-sidebar2',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Bấm vào nút mũi tên tròn ở góc dưới bên phải thanh bên để thu gọn/mở rộng. Các nhóm menu con sử dụng Accordion của Bootstrap.`
            }
        ]
    },
    {
        id: 'tab-topbar',
        btnId: 'tab-topbar-btn',
        title: '9. Topbar Components',
        desc: 'Thanh điều hướng đầu trang (Topbar) chuẩn Google Analytics',
        icon: 'bi-layout-text-window-reverse text-info',
        active: false,
        items: [
            {
                sampleId: 'topbar-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-info text-white',
                title: 'Analytics Topbar (Thanh điều hướng tiêu chuẩn Google Analytics)',
                htmlFile: 'topbar1.html',
                cssFile: 'topbar1.css',
                jsFile: null,
                previewId: 'preview-topbar1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Topbar tiêu chuẩn với logo Analytics động, ô chọn tài khoản, thanh tìm kiếm mở rộng và khu vực profile cá nhân.`
            }
        ]
    },
    {
        id: 'tab-tabs',
        btnId: 'tab-tabs-btn',
        title: '10. Tabs Components',
        desc: 'Các mẫu Tab điều hướng và quản lý tab khám phá dữ liệu nâng cao',
        icon: 'bi-segmented-nav text-success',
        active: false,
        items: [
            {
                sampleId: 'tabs-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-success',
                title: 'Analytics Exploration Tabs (Thanh tab khám phá dữ liệu linh hoạt, thêm/xóa/nhân bản tab)',
                htmlFile: 'tabs1.html',
                cssFile: 'tabs1.css',
                jsFile: 'tabs1.js',
                previewId: 'preview-tabs1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Hệ thống tab khám phá nâng cao cho phép chuyển đổi loại báo cáo (Biểu mẫu tùy ý, Phễu, Khám phá người dùng...), thêm tab mới qua dropdown, xóa và nhân bản tab tức thì.`
            }
        ]
    },
    {
        id: 'tab-tables',
        btnId: 'tab-tables-btn',
        title: '11. Table Components',
        desc: 'Các mẫu Bảng dữ liệu (Data Table) phân tích chuyên sâu với 2 cột cố định (Sticky Columns), bộ lọc và chỉ số tương tác',
        icon: 'bi-table text-primary',
        active: false,
        items: [
            {
                sampleId: 'table-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Data Table (Bảng dữ liệu phân tích chi tiết với 2 cột cố định, tìm kiếm và phân trang)',
                htmlFile: 'table1.html',
                cssFile: 'table1.css',
                jsFile: null,
                previewId: 'preview-table1',
                previewClass: '',
                depBadges: [
                    { type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap Icons (Bắt buộc)' },
                    { type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' },
                    { type: 'rec', text: 'Google Font Roboto (Khuyên dùng)' }
                ],
                depCode: `<!-- 1. Google Font Roboto (Đặt trong <head>) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- 2. Bootstrap 5 CSS (Đặt trong <head>) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 3. Bootstrap Icons (Đặt trong <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- 4. Bootstrap 5 JavaScript Bundle (Đặt trước </body>) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`,
                depNote: `<strong>Lưu ý cho Dev:</strong> Bảng phân tích đa chiều chuyên sâu có 2 cột cố định (checkbox & thứ nguyên), thanh công cụ tìm kiếm, chọn số hàng mỗi trang và hỗ trợ cuộn ngang mượt mà.`
            }
        ]
    }
];

// Tạo cấu trúc Navigation Tabs bên trái
let sidebarNavHtml = '';
categories.forEach(cat => {
    sidebarNavHtml += `
                    <!-- Tab ${cat.title.split('.')[1].trim()} -->
                    <button class="nav-link ${cat.active ? 'active' : ''} d-flex align-items-center justify-content-between mb-1"
                        id="${cat.btnId}" data-bs-toggle="pill" data-bs-target="#${cat.id}" type="button"
                        role="tab" aria-controls="${cat.id}" aria-selected="${cat.active ? 'true' : 'false'}">
                        <span class="d-flex align-items-center gap-2">
                            <i class="bi ${cat.icon}"></i>
                            <span>${cat.title.split('.')[1].replace('Components', '').trim()}</span>
                        </span>
                    </button>`;
});

// Tạo nội dung từng Tab
let mainTabContentHtml = '';

categories.forEach(cat => {
    let quickLinksHtml = cat.items.map(it => `<a href="#${it.sampleId}" class="btn btn-sm btn-outline-secondary">${it.badgeText}: ${it.title.split('(')[0].trim()}</a>`).join('\n                                ');

    let sectionsHtml = '';
    cat.items.forEach((item, idx) => {
        const rawHtml = fs.readFileSync(path.join(DIR, item.htmlFile), 'utf-8');
        const componentHtml = extractComponentHtml(rawHtml);
        let previewHtml = componentHtml;
        if (item.sampleId === 'card-mau-8') {
            previewHtml = previewHtml
                .replace(/id="interactiveLayer"/g, 'id="interactiveLayer8"')
                .replace(/id="chartTooltip"/g, 'id="chartTooltip8"')
                .replace(/id="ttDate"/g, 'id="ttDate8"')
                .replace(/id="ttContent"/g, 'id="ttContent8"')
                .replace(/id="mainChart"/g, 'id="mainChart8"');
        }
        const cssContent = item.cssFile ? fs.readFileSync(path.join(DIR, item.cssFile), 'utf-8') : '';
        const jsContent = item.jsFile ? fs.readFileSync(path.join(DIR, item.jsFile), 'utf-8') : '';

        // Generate dep badges
        let badgesHtml = item.depBadges.map(b => {
            const cls = b.type === 'req' ? 'dep-badge-req' : 'dep-badge-rec';
            const ico = b.type === 'req' ? 'bi-check-circle-fill' : 'bi-info-circle';
            return `<span class="dep-badge-pill ${cls}"><i class="bi ${ico}"></i> ${b.text}</span>`;
        }).join('\n                                        ');

        // Test template
        let testTemplateHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test ${item.title.split('(')[0].trim()}</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
/* Dán CSS ${item.cssFile || ''} vào đây */
    </style>
</head>
<body class="p-4 bg-light">
    <!-- Dán HTML của component vào đây -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

        const codeHtmlId = `code-html-${item.htmlFile.replace('.html', '')}`;
        const codeCssId = `code-css-${item.htmlFile.replace('.html', '')}`;
        const codeJsId = item.jsFile ? `code-js-${item.jsFile.replace('.js', '')}` : '';
        const depCodeId = `dep-code-${item.htmlFile.replace('.html', '')}`;
        const templateCodeId = `template-${item.htmlFile.replace('.html', '')}`;

        let jsCardHtml = '';
        if (item.jsFile && jsContent) {
            jsCardHtml = `
                            <!-- Khối 3: NỘI DUNG JAVASCRIPT -->
                            <div class="code-card mb-4">
                                <div class="code-header py-2 px-3 d-flex justify-content-between align-items-center">
                                    <div class="text-warning fw-bold small d-flex align-items-center gap-2">
                                        <i class="bi bi-filetype-js fs-5"></i> NỘI DUNG JAVASCRIPT
                                    </div>
                                    <button class="btn btn-sm btn-outline-light copy-btn"
                                        onclick="copyCode('${codeJsId}', this)">
                                        <i class="bi bi-clipboard me-1"></i> Copy JS
                                    </button>
                                </div>
                                <div class="p-0">
                                    <pre class="text-light m-0 p-3 code-pre"><code id="${codeJsId}">${escapeHtml(jsContent.trim())}</code></pre>
                                </div>
                            </div>`;
        }

        sectionsHtml += `
                        <!-- ---------------------------------------------- -->
                        <!-- ${item.badgeText}: ${item.title} -->
                        <!-- ---------------------------------------------- -->
                        <section id="${item.sampleId}" class="mb-5 pt-2">
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="badge ${item.badgeClass} px-2 py-1 rounded-pill">${item.badgeText}</span>
                                <h2 class="h5 fw-bold mb-0">${item.title}</h2>
                            </div>

                            <!-- Giao diện xem trước -->
                            <div class="preview-card mb-4 bg-white">
                                <div class="card-header bg-white py-3 px-3 d-flex align-items-center justify-content-between border-bottom">
                                    <span class="fw-bold text-dark d-flex align-items-center gap-2">
                                        <i class="bi bi-eye text-primary"></i> Giao diện xem trước
                                    </span>
                                    <span class="badge bg-light text-secondary border">Interactive</span>
                                </div>
                                <div class="preview-container ${item.previewClass}" id="${item.previewId}">
                                    ${previewHtml}
                                </div>
                            </div>

                            <!-- Khối Thư Viện & Phụ Thuộc Cần Nhúng -->
                            <div class="dependency-card mb-4">
                                <div class="dependency-header">
                                    <div class="dependency-title">
                                        <i class="bi bi-box-seam text-primary fs-5"></i>
                                        <span>THƯ VIỆN &amp; PHỤ THUỘC CẦN NHÚNG</span>
                                    </div>
                                    <button class="btn btn-sm btn-outline-primary copy-btn py-1 px-3 rounded-2"
                                        onclick="copyCode('${depCodeId}', this)">
                                        <i class="bi bi-clipboard me-1"></i> Copy Thư Viện
                                    </button>
                                </div>
                                <div class="dependency-body">
                                    <div class="dep-badges-wrap">
                                        ${badgesHtml}
                                    </div>

                                    <div class="dep-code-box">
                                        <pre><code id="${depCodeId}">${escapeHtml(item.depCode)}</code></pre>
                                    </div>

                                    <div class="dep-note-box alert-warning-soft">
                                        <i class="bi bi-exclamation-triangle-fill flex-shrink-0 mt-0.5 fs-6 text-warning"></i>
                                        <div>
                                            ${item.depNote}
                                        </div>
                                    </div>

                                    <details class="dep-template-details mt-2">
                                        <summary class="d-flex align-items-center gap-1">
                                            <i class="bi bi-file-earmark-code text-secondary"></i>
                                            <span>Xem khung code mẫu tối thiểu để test riêng (Test Template)</span>
                                            <span class="badge bg-light text-secondary border ms-1" style="font-size: 11px;">Mở rộng</span>
                                        </summary>
                                        <div class="dep-template-box mt-2">
                                            <div class="d-flex justify-content-between align-items-center px-3 py-1.5 border-bottom border-secondary border-opacity-25" style="background: #1e293b;">
                                                <span class="text-secondary small" style="font-size: 11px;"><i class="bi bi-code-slash me-1"></i> test_${item.htmlFile}</span>
                                                <button class="btn btn-sm btn-outline-light py-0 px-2 copy-btn" style="font-size: 11px;" onclick="copyCode('${templateCodeId}', this)">
                                                    <i class="bi bi-clipboard me-1"></i> Copy Template
                                                </button>
                                            </div>
                                            <pre><code id="${templateCodeId}">${escapeHtml(testTemplateHtml)}</code></pre>
                                        </div>
                                    </details>
                                </div>
                            </div>

                            <!-- Khối 1: NỘI DUNG HTML -->
                            <div class="code-card mb-4">
                                <div class="code-header py-2 px-3 d-flex justify-content-between align-items-center">
                                    <div class="text-warning fw-bold small d-flex align-items-center gap-2">
                                        <i class="bi bi-filetype-html fs-5"></i> NỘI DUNG HTML
                                    </div>
                                    <button class="btn btn-sm btn-outline-light copy-btn"
                                        onclick="copyCode('${codeHtmlId}', this)">
                                        <i class="bi bi-clipboard me-1"></i> Copy HTML
                                    </button>
                                </div>
                                <div class="p-0">
                                    <pre class="text-light m-0 p-3 code-pre"><code id="${codeHtmlId}">${escapeHtml(componentHtml)}</code></pre>
                                </div>
                            </div>

                            <!-- Khối 2: NỘI DUNG CSS -->
                            <div class="code-card mb-4">
                                <div class="code-header py-2 px-3 d-flex justify-content-between align-items-center">
                                    <div class="text-info fw-bold small d-flex align-items-center gap-2">
                                        <i class="bi bi-filetype-css fs-5"></i> NỘI DUNG CSS
                                    </div>
                                    <button class="btn btn-sm btn-outline-light copy-btn"
                                        onclick="copyCode('${codeCssId}', this)">
                                        <i class="bi bi-clipboard me-1"></i> Copy CSS
                                    </button>
                                </div>
                                <div class="p-0">
                                    <pre class="text-light m-0 p-3 code-pre"><code id="${codeCssId}">${escapeHtml(cssContent.trim())}</code></pre>
                                </div>
                            </div>
                            ${jsCardHtml}
                        </section>
                        ${idx < cat.items.length - 1 ? '<hr class="my-5 border-2 border-secondary-subtle">' : ''}`;
    });

    mainTabContentHtml += `
                    <!-- ============================================== -->
                    <!-- ${cat.title.toUpperCase()} -->
                    <!-- ============================================== -->
                    <div class="tab-pane fade ${cat.active ? 'show active' : ''}" id="${cat.id}" role="tabpanel"
                        aria-labelledby="${cat.btnId}">

                        <!-- Tiêu đề & Nút điều hướng nhanh -->
                        <div class="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom gap-2">
                            <div>
                                <h1 class="h3 fw-bold mb-1">${cat.title}</h1>
                                <p class="text-muted mb-0 small">${cat.desc}</p>
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                ${quickLinksHtml}
                            </div>
                        </div>

                        ${sectionsHtml}
                    </div>`;
});

// Toàn bộ khung HTML hoàn chỉnh
const fullHtml = `<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Components Library</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

    <!-- Bootstrap 5 CSS & Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

    <!-- CSS từng Component -->
    <link rel="stylesheet" href="accordion1.css">
    <link rel="stylesheet" href="card1.css">
    <link rel="stylesheet" href="card2.css">
    <link rel="stylesheet" href="card3.css">
    <link rel="stylesheet" href="card4.css">
    <link rel="stylesheet" href="card5.css">
    <link rel="stylesheet" href="card6.css">
    <link rel="stylesheet" href="card7.css">
    <link rel="stylesheet" href="card8.css">
    <link rel="stylesheet" href="card9.css">
    <link rel="stylesheet" href="carousel1.css">
    <link rel="stylesheet" href="carousel2.css">
    <link rel="stylesheet" href="carousel3.css">
    <link rel="stylesheet" href="dropdown1.css">
    <link rel="stylesheet" href="dropdown2.css">
    <link rel="stylesheet" href="modal1.css">
    <link rel="stylesheet" href="modal2.css">
    <link rel="stylesheet" href="offcanvas1.css">
    <link rel="stylesheet" href="offcanvas2.css">
    <link rel="stylesheet" href="offcanvas3.css">
    <link rel="stylesheet" href="offcanvas4.css">
    <link rel="stylesheet" href="popover1.css">
    <link rel="stylesheet" href="popover2.css">
    <link rel="stylesheet" href="sidebar1.css">
    <link rel="stylesheet" href="sidebar2.css">
    <link rel="stylesheet" href="table1.css">
    <link rel="stylesheet" href="tabs1.css">
    <link rel="stylesheet" href="topbar1.css">

    <!-- CSS Gốc Layout & Navigation Portal -->
    <link rel="stylesheet" href="testcss.css">
</head>

<body>

    <div class="container-fluid">
        <div class="row">
            <!-- ============================================== -->
            <!-- SIDEBAR BÊN TRÁI: DANH SÁCH CÁC COMPONENTS (TABS) -->
            <!-- ============================================== -->
            <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-white sidebar custom-sidebar p-3 border-end">
                <div class="brand-header pb-3 mb-3 border-bottom d-flex align-items-center gap-2">
                    <div class="brand-icon rounded-3 d-flex align-items-center justify-content-center text-white">
                        <i class="bi bi-graph-up-arrow fs-5"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold text-dark">Analytics Library</h6>
                        <small class="text-muted" style="font-size: 11px;">Components Showcase</small>
                    </div>
                </div>

                <div class="px-2 mb-2 text-uppercase text-muted fw-bold"
                    style="font-size: 11px; letter-spacing: 0.5px;">
                    Danh sách Components
                </div>

                <!-- Danh sách tabs chuyển đổi component -->
                <div class="nav flex-column nav-pills custom-sidebar-nav" id="componentTabs" role="tablist"
                    aria-orientation="vertical">
${sidebarNavHtml}
                </div>
            </nav>

            <!-- ============================================== -->
            <!-- NỘI DUNG CHÍNH BÊN PHẢI (HIỂN THỊ THEO TAB) -->
            <!-- ============================================== -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 main-content">
                <div class="tab-content" id="componentTabsContent">
${mainTabContentHtml}
                </div>
            </main>
        </div>
    </div>

    <!-- Bootstrap 5 JavaScript Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <!-- JavaScript Engine chung (Copy code, Hash sync, Component Interactions) -->
    <script src="testjs.js"></script>
</body>

</html>
`;

fs.writeFileSync(path.join(DIR, 'index.html'), fullHtml, 'utf-8');
console.log('Successfully generated index.html at ' + path.join(DIR, 'index.html'));
