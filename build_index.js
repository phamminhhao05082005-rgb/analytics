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

// Hàm trích xuất chính xác các thư viện bên ngoài từ file HTML của mẫu
function extractExternalDependencies(htmlContent) {
    const externalLinks = [];
    const linkRegex = /<link\b[^>]*>/gi;
    let m;
    while ((m = linkRegex.exec(htmlContent)) !== null) {
        const tag = m[0].trim();
        // Bỏ qua CSS nội bộ của mẫu (ví dụ: accordion1.css, card1.css...), chỉ lấy link http/https bên ngoài
        if (/href=["']https?:\/\//i.test(tag)) {
            externalLinks.push(tag);
        }
    }

    const externalScripts = [];
    const scriptRegex = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
    while ((m = scriptRegex.exec(htmlContent)) !== null) {
        const tag = m[0].trim();
        // Bỏ qua JS nội bộ của mẫu (ví dụ: carousel1.js, card3.js...), chỉ lấy script http/https bên ngoài
        if (/src=["']https?:\/\//i.test(tag)) {
            externalScripts.push(tag);
        }
    }

    // Tạo danh sách badges tương ứng chính xác với các thư viện được nhúng
    const badges = [];
    externalLinks.forEach(tag => {
        if (/bootstrap(\.min)?\.css/i.test(tag)) {
            badges.push({ type: 'req', text: 'Bootstrap 5 CSS (Bắt buộc)' });
        } else if (/bootstrap-icons/i.test(tag)) {
            badges.push({ type: 'req', text: 'Bootstrap Icons (Bắt buộc)' });
        } else if (/fonts\.googleapis/i.test(tag)) {
            badges.push({ type: 'rec', text: 'Google Font (Khuyên dùng)' });
        } else {
            badges.push({ type: 'req', text: 'External CSS Library' });
        }
    });

    externalScripts.forEach(tag => {
        if (/bootstrap(\.bundle)?(\.min)?\.js/i.test(tag)) {
            badges.push({ type: 'req', text: 'Bootstrap 5 JS Bundle (Bắt buộc)' });
        } else {
            badges.push({ type: 'req', text: 'External JS Library' });
        }
    });

    // Tạo khối code nhúng bên ngoài chuẩn xác và sạch sẽ
    let depCodeParts = [];
    let counter = 1;
    externalLinks.forEach(l => {
        const name = /bootstrap-icons/i.test(l) ? 'Bootstrap Icons' : (/bootstrap/i.test(l) ? 'Bootstrap 5 CSS' : 'Thư viện CSS');
        depCodeParts.push(`<!-- ${counter++}. ${name} (Đặt trong <head>) -->`);
        depCodeParts.push(l);
        depCodeParts.push('');
    });
    externalScripts.forEach(s => {
        const name = /bootstrap/i.test(s) ? 'Bootstrap 5 JavaScript Bundle (Chứa cả Popper)' : 'Thư viện JavaScript';
        depCodeParts.push(`<!-- ${counter++}. ${name} (Đặt trước thẻ đóng </body>) -->`);
        depCodeParts.push(s);
        depCodeParts.push('');
    });
    if (depCodeParts.length > 0 && depCodeParts[depCodeParts.length - 1] === '') {
        depCodeParts.pop();
    }

    return {
        badges,
        code: depCodeParts.join('\n'),
        links: externalLinks,
        scripts: externalScripts
    };
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
                depNote: '<strong>Lưu ý quan trọng cho Dev:</strong> Tính năng đóng mở phụ thuộc trực tiếp vào thuộc tính <code>data-bs-toggle="collapse"</code> của <strong>Bootstrap JS Bundle</strong>. Khi nhúng cần đảm bảo có file <code>bootstrap.bundle.min.js</code>.'
            },
            {
                sampleId: 'acc-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-success',
                title: 'Advanced Ads Settings Accordion (Chế độ cài đặt nâng cao để bật tính năng cá nhân hoá quảng cáo)',
                htmlFile: 'accordion2.html',
                cssFile: 'accordion2.css',
                jsFile: null,
                previewId: 'preview-accordion2',
                previewClass: '',
                depNote: '<strong>Lưu ý quan trọng cho Dev:</strong> Tính năng mở rộng / thu gọn dựa trên thuộc tính <code>data-bs-toggle="collapse"</code> và <code>data-bs-target="#collapseAds"</code> của <strong>Bootstrap 5 JS Bundle</strong>.'
            },
            {
                sampleId: 'acc-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-info text-white',
                title: 'User ID & Data Collection Accordion (Tính năng User-ID và thu thập dữ liệu do người dùng cung cấp)',
                htmlFile: 'accordion3.html',
                cssFile: 'accordion3.css',
                jsFile: null,
                previewId: 'preview-accordion3',
                previewClass: '',
                depNote: '<strong>Lưu ý quan trọng cho Dev:</strong> Accordion kết hợp đồ họa vector SVG minh họa trực quan cùng khung thông tin <code>.bordered-box</code> và tính năng thu gọn/mở rộng chuẩn Bootstrap 5.'
            },
            {
                sampleId: 'acc-mau-4',
                badgeText: 'Mẫu 4',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Consent Signals Accordion (Tín hiệu đồng ý liên quan đến quảng cáo & mức độ tác động)',
                htmlFile: 'accordion4.html',
                cssFile: 'accordion4.css',
                jsFile: null,
                previewId: 'preview-accordion4',
                previewClass: '',
                depNote: '<strong>Lưu ý quan trọng cho Dev:</strong> Accordion hiển thị trạng thái tín hiệu đồng ý kèm lưới 2 cột phân tích chi tiết mức độ tác động (đo lường, tái tiếp thị, xuất chuyển đổi); đóng mở mượt mà bằng <code>data-bs-toggle="collapse"</code>.'
            },
            {
                sampleId: 'acc-mau-5',
                badgeText: 'Mẫu 5',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Terms Accordion (Điều khoản bảo vệ dữ liệu với khung cuộn & nút chấp nhận)',
                htmlFile: 'accordion5.html',
                cssFile: 'accordion5.css',
                jsFile: null,
                previewId: 'preview-accordion5',
                previewClass: 'p-4',
                depNote: '<strong>Lưu ý cho Dev:</strong> Mẫu điều khoản accordion tích hợp tiêu đề trạng thái với icon thành công, nội dung điều khoản GDPR có khung cuộn thanh cuộn tùy chỉnh và nút xác nhận. Đóng mở dựa vào <code>data-bs-toggle="collapse"</code> của <strong>Bootstrap JS Bundle</strong>.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Component sử dụng thanh cuộn tùy chỉnh <code>.custom-scrollbar</code> cùng đồ họa vector SVG inline mô phỏng biểu đồ Analytics.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ dạng banner responsive, tự động chuyển đổi bố cục flex dạng cột trên màn hình hẹp (dưới 900px).'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ trực quan kèm thanh trượt chọn các chỉ số phân tích (Metrics) và popover hiển thị giá trị khi rê chuột qua các điểm dữ liệu.'
            },
            {
                sampleId: 'card-mau-4',
                badgeText: 'Mẫu 4',
                badgeClass: 'text-bg-success',
                title: 'Analytics Detailed Bar Chart Card (Thẻ biểu đồ cột phân tích người dùng theo thời gian kèm bảng dữ liệu & bộ lọc)',
                htmlFile: 'card4.html',
                cssFile: 'card4.css',
                jsFile: 'card4.js',
                previewId: 'preview-card4',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ phân tích tổng số người dùng theo đối tượng (All Users, New Users, Returning Users) dạng biểu đồ cột SVG tương tác, hỗ trợ chọn chu kỳ Ngày/Tuần/Tháng, tìm kiếm bảng và dựng đồ thị hàng theo checkbox. Cần nhúng file <code>card4.js</code> để kích hoạt tương tác.'
            },
            {
                sampleId: 'card-mau-5',
                badgeText: 'Mẫu 5',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Funnel Chart Card (Thẻ biểu đồ phễu chuyển đổi & tỷ lệ bỏ ngang qua từng bước)',
                htmlFile: 'card5.html',
                cssFile: 'card5.css',
                jsFile: 'card5.js',
                previewId: 'preview-card5',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ phễu (Funnel) phân tích hành trình khách hàng từ bắt đầu phiên, thêm vào giỏ hàng đến mua hàng với công tắc đóng/mở phễu, bộ lọc tìm kiếm danh mục thiết bị và dropdown chọn số hàng hiển thị trên mỗi trang. Cần nhúng file <code>card5.js</code> để kích hoạt tương tác.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ hiển thị danh sách các sự kiện theo tên (page_view, scroll, session_start...) với thanh tiến trình trực quan và dropdown kiểm tra dữ liệu.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ động cho phép chọn tab số liệu (Thời gian tương tác, số phiên...) để tự động vẽ lại đường biểu đồ SVG và dải giá trị tương ứng.'
            },
            {
                sampleId: 'card-mau-8',
                badgeText: 'Mẫu 8',
                badgeClass: 'text-bg-dark',
                title: 'Analytics Detailed Multi-Line Chart Card (Thẻ biểu đồ đa đường phân tích theo Đường dẫn trang kèm bảng dữ liệu & bộ lọc)',
                htmlFile: 'card8.html',
                cssFile: 'card8.css',
                jsFile: 'card8.js',
                previewId: 'preview-card8',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Biểu đồ đa đường phân tích số lượt xem theo đường dẫn trang (/shop/new, /shop/clearance...) qua thời gian, hỗ trợ chuyển đổi chu kỳ Ngày/Tuần/Tháng, tìm kiếm dữ liệu, dựng lại đồ thị theo hàng được chọn và hover làm nổi bật đường tương ứng. Cần nhúng file <code>card8.js</code> để kích hoạt tương tác.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ hiển thị phân bố người dùng mới theo nền tảng dạng bong bóng tròn ấn tượng kèm tỷ lệ phần trăm chi tiết.'
            },
            {
                sampleId: 'card-mau-10',
                badgeText: 'Mẫu 10',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Realtime Card (Thẻ người dùng hoạt động theo thời gian thực 30 phút qua)',
                htmlFile: 'card10.html',
                cssFile: 'card10.css',
                jsFile: 'card10.js',
                previewId: 'preview-card10',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ hiển thị số liệu thời gian thực dạng thanh cột (bar chart), bảng xếp hạng động theo quốc gia/thành phố với dropdown lựa chọn thứ nguyên. Cần nhúng file <code>card10.js</code> để kích hoạt chọn thứ nguyên trong dropdown.'
            },
            {
                sampleId: 'card-mau-11',
                badgeText: 'Mẫu 11',
                badgeClass: 'text-bg-info text-white',
                title: 'Analytics Dashboard Metrics & Trend Card (Thẻ thanh trượt chỉ số đo lường & biểu đồ xu hướng SVG)',
                htmlFile: 'card11.html',
                cssFile: 'card11.css',
                jsFile: 'card11.js',
                previewId: 'preview-card11',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ bảng điều khiển cao cấp chứa thanh trượt chọn chỉ số (Người dùng hoạt động, Sự kiện quan trọng, Phiên, Mua hàng) và biểu đồ đường xu hướng SVG tương tác kèm popover chi tiết. Cần nhúng file <code>card11.js</code> để bật animation thanh trượt và hover biểu đồ.'
            },
            {
                sampleId: 'card-mau-12',
                badgeText: 'Mẫu 12',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Acquisition Bar Chart Card (Thẻ biểu đồ cột ngang phân tích thu nạp người dùng mới)',
                htmlFile: 'card12.html',
                cssFile: 'card12.css',
                jsFile: 'card12.js',
                previewId: 'preview-card12',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ cột ngang SVG phân tích nguồn người dùng mới (Direct, Organic Search, Paid Search...) hỗ trợ sọc so sánh 2 kỳ (kỳ này vs kỳ trước) và popover hiển thị tỷ lệ tăng giảm tương tác khi di chuột. Cần nhúng file <code>card12.js</code> để kích hoạt hiệu ứng hover & popover.'
            },
            {
                sampleId: 'card-mau-13',
                badgeText: 'Mẫu 13',
                badgeClass: 'text-bg-success',
                title: 'Analytics User Activity Over Time Card (Thẻ biểu đồ đường hoạt động người dùng theo 1, 7 và 30 ngày)',
                htmlFile: 'card13.html',
                cssFile: 'card13.css',
                jsFile: 'card13.js',
                previewId: 'preview-card13',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ theo dõi nhịp độ hoạt động của người dùng với 3 đường SVG tương ứng 30 ngày, 7 ngày và 1 ngày, tích hợp thống kê tỷ lệ biến động bên phải và popover chi tiết theo từng ngày khi hover. Cần nhúng file <code>card13.js</code> để kích hoạt hiệu ứng hover tương tác.'
            },
            {
                sampleId: 'card-mau-14',
                badgeText: 'Mẫu 14',
                badgeClass: 'text-bg-secondary',
                title: 'Analytics Data Settings Card (Thẻ danh mục cấu hình cài đặt thu thập và sửa đổi dữ liệu)',
                htmlFile: 'card14.html',
                cssFile: 'card14.css',
                jsFile: 'card14.js',
                previewId: 'preview-card14',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ cài đặt chuyên nghiệp hiển thị danh sách các mục quản trị luồng dữ liệu, thu thập, nhập và bộ lọc với icon nhận diện và tooltip hướng dẫn. Cần nhúng file <code>card14.js</code> (hoặc kích hoạt Bootstrap Tooltip) để hiển thị trợ giúp khi hover icon dấu hỏi.'
            },
            {
                sampleId: 'card-mau-15',
                badgeText: 'Mẫu 15',
                badgeClass: 'text-bg-dark',
                title: 'Analytics Display Settings Card (Thẻ danh mục cấu hình hiển thị dữ liệu & báo cáo)',
                htmlFile: 'card15.html',
                cssFile: 'card15.css',
                jsFile: 'card15.js',
                previewId: 'preview-card15',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ điều hướng danh mục báo cáo quản trị toàn diện gồm 10 mục cài đặt (Sự kiện, Mạng, Đối tượng, Chú thích, Phép so sánh, Phân đoạn, DebugView...) đi kèm tooltip giải thích chi tiết khi hover.'
            },
            {
                sampleId: 'card-mau-16',
                badgeText: 'Mẫu 16',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Insights Card (Thẻ thông tin chi tiết thông minh kèm biểu đồ bất thường & mở rộng Offcanvas)',
                htmlFile: 'card16.html',
                cssFile: 'card16.css',
                jsFile: null,
                previewId: 'preview-card16',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ phân tích thông tin chi tiết (Intelligence Insights) hiển thị cảnh báo doanh thu bất thường kèm biểu đồ vùng dự kiến SVG. Nút phóng to ở chân card kết nối trực tiếp với <strong>Bootstrap Offcanvas</strong> (<code>data-bs-toggle="offcanvas"</code>) để xem phân tích chi tiết bên bảng trượt phải.'
            },
            {
                sampleId: 'card-mau-17',
                badgeText: 'Mẫu 17',
                badgeClass: 'text-bg-success',
                title: 'Analytics Geo Chart Card (Thẻ bản đồ địa lý Google Charts phân bố người dùng theo quốc gia)',
                htmlFile: 'card17.html',
                cssFile: 'card17.css',
                jsFile: 'card17.js',
                previewId: 'preview-card17',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ bản đồ địa lý trực quan tích hợp <strong>Google Charts GeoChart</strong> (<code>https://www.gstatic.com/charts/loader.js</code>), bảng phân tích quốc gia dạng thanh tiến trình và công cụ điều khiển phóng to/thu nhỏ (Zoom in/out), kéo rê bản đồ (Pan & Drag). Cần nhúng thư viện Google Charts và file <code>card17.js</code> để khởi tạo.'
            },
            {
                sampleId: 'card-mau-18',
                badgeText: 'Mẫu 18',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Cohort Activity Table Card (Thẻ ma trận bản đồ nhiệt hoạt động người dùng theo nhóm thuần tập)',
                htmlFile: 'card18.html',
                cssFile: 'card18.css',
                jsFile: 'card18.js',
                previewId: 'preview-card18',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ bảng ma trận phân tích thuần tập (Cohort Activity / Retention Heatmap) theo dõi tỷ lệ giữ chân người dùng qua 6 tuần (Tuần 0 đến Tuần 5) với 5 cấp độ màu nhiệt sắc trực quan và popover chi tiết hiển thị số lượng người dùng khi rê chuột. Cần nhúng file <code>card18.js</code> để kích hoạt hover popover.'
            },
            {
                sampleId: 'card-mau-19',
                badgeText: 'Mẫu 19',
                badgeClass: 'text-bg-info text-white',
                title: 'Analytics Venn Diagram Card (Thẻ biểu đồ Venn giao thoa phân tích người dùng theo nền tảng)',
                htmlFile: 'card19.html',
                cssFile: 'card19.css',
                jsFile: 'card19.js',
                previewId: 'preview-card19',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ biểu đồ Venn giao thoa phân tích người dùng hoạt động theo nền tảng (Android, iOS, Web) với hiệu ứng làm mờ/làm nổi bật vòng tròn giao thoa và popover thông số chi tiết khi rê chuột. Cần nhúng file <code>card19.js</code> để kích hoạt hiệu ứng hover & popover.'
            },
            {
                sampleId: 'card-mau-20',
                badgeText: 'Mẫu 20',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Insights List Card (Thẻ danh sách thông tin chi tiết & đề xuất thông minh kèm nút đánh giá)',
                htmlFile: 'card20.html',
                cssFile: 'card20.css',
                jsFile: null,
                previewId: 'preview-card20',
                previewClass: 'p-4 d-flex justify-content-center bg-light',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thẻ danh sách thông tin chi tiết và đề xuất tối ưu hóa (Recommendations & Insights) với badge đếm số lượng, khung cuộn nội dung <code>.custom-scrollbar</code>, các nút đánh giá thích/không thích (Thumbs Up/Down) xuất hiện mượt mà khi hover và hiệu ứng đổi màu thương hiệu Google Analytics.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Component cần script <code>carousel1.js</code> để tính toán khoảng trượt và kích hoạt ẩn/hiện nút Next/Prev.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Component cần script <code>carousel2.js</code> để điều hướng thanh trượt bản khám phá, tính toán độ rộng thẻ và vô hiệu hóa nút Prev/Next khi tới biên.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Component cần script <code>carousel3.js</code> để cuộn ngang qua các mục báo cáo xem gần đây.'
            }
        ]
    },
    {
        id: 'tab-dropdowns',
        btnId: 'tab-dropdowns-btn',
        title: '4. Dropdown Components',
        desc: 'Các menu thả xuống cho Apps Launcher, Quản lý tài khoản cá nhân, Chọn lượt chuyển đổi và Cài đặt phân bổ',
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Sử dụng thuộc tính <code>data-bs-auto-close="outside"</code> giúp menu không bị đóng khi click vào nhóm "Khám phá thêm" thu gọn/mở rộng.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Menu quản lý tài khoản hiển thị avatar màu cùng liên kết chính sách và các thao tác tài khoản nhanh.'
            },
            {
                sampleId: 'dropdown-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Conversions Dropdown (Menu chọn các hành động chuyển đổi đa cấp có tìm kiếm & checkbox)',
                htmlFile: 'dropdown3.html',
                cssFile: 'dropdown3.css',
                jsFile: 'dropdown3.js',
                previewId: 'preview-dropdown3',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Menu chọn lượt chuyển đổi đa cấp tích hợp ô tìm kiếm lọc nhanh danh mục tức thì, hộp thông báo hướng dẫn phân bổ tài sản, nhóm danh mục thu gọn/mở rộng bằng icon chevron, checkbox cha/con tự động đồng bộ trạng thái bán phần (indeterminate) và nút Áp dụng/Hủy. Cần nhúng file <code>dropdown3.js</code> để kích hoạt tương tác.'
            },
            {
                sampleId: 'dropdown-mau-4',
                badgeText: 'Mẫu 4',
                badgeClass: 'text-bg-info text-white',
                title: 'Analytics Conversion Settings Dropdown (Menu cấu hình mô hình phân bổ và thời điểm phân bổ chuyển đổi)',
                htmlFile: 'dropdown4.html',
                cssFile: 'dropdown4.css',
                jsFile: 'dropdown4.js',
                previewId: 'preview-dropdown4',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Menu cấu hình cài đặt chuyển đổi đa tiêu chí gồm kênh đóng góp, các nhóm radio chọn mô hình phân bổ (Dựa trên dữ liệu, Lượt nhấp cuối cùng) và thời điểm phân bổ (theo thời gian chuyển đổi, theo thời gian tương tác) với hiệu ứng background tròn nổi bật khi active. Tự động kiểm tra thay đổi để kích hoạt nút Áp dụng và khôi phục trạng thái ban đầu khi Hủy hoặc đóng menu. Cần nhúng file <code>dropdown4.js</code> để kích hoạt tương tác.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Hộp thoại chứa các tab chọn lọc (Tất cả, Ưa thích, Gần đây) và bộ lọc thuộc tính. Click vào nút "Minh Hào" trong bản xem trước để mở Modal.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Hộp thoại phân quyền toàn diện kích thước 90vw x 90vh với đầy đủ danh sách vai trò chuẩn (Quản trị viên, Người chỉnh sửa, Người xem...) và các quy định hạn chế dữ liệu tài sản. Bấm nút trong bản xem trước để mở Modal.'
            },
            {
                sampleId: 'modal-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-success',
                title: 'Analytics Filter Modal (Hộp thoại tạo bộ lọc phân tích điều kiện phương diện & kiểu khớp)',
                htmlFile: 'modal3.html',
                cssFile: 'modal3.css',
                jsFile: 'modal3.js',
                previewId: 'preview-modal3',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Hộp thoại tạo bộ lọc phân tích Google Analytics với dropdown chọn phương diện (Chung, Giờ...), kiểu khớp (khớp chính xác, chứa...) và ô nhập giá trị. Cần script <code>modal3.js</code> để kích hoạt chọn phương diện, tính năng xóa form và tự động kích hoạt nút "Áp dụng" khi đủ dữ liệu.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Bảng trượt từ cạnh phải (offcanvas-end) chứa danh sách câu hỏi thông minh dạng Accordion đa cấp.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Cần script <code>offcanvas2.js</code> để thực hiện animation trượt mượt mà giữa màn hình xem và form nhập chú thích.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Cần script <code>offcanvas3.js</code> để quản lý trạng thái chọn checkbox, lọc tìm kiếm bảng và hiển thị các tag pill đã chọn.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Bảng điều khiển cài đặt trượt từ cạnh phải (Offcanvas End) phục vụ cấu hình biểu mẫu, chọn dạng trực quan và thả phân đoạn so sánh.'
            },
            {
                sampleId: 'offcanvas-mau-5',
                badgeText: 'Mẫu 5',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Web Stream Details Offcanvas (Bảng thông tin chi tiết về luồng web & đo lường sự kiện nâng cao)',
                htmlFile: 'offcanvas5.html',
                cssFile: 'offcanvas5.css',
                jsFile: null,
                previewId: 'preview-offcanvas5',
                previewClass: 'p-4',
                depNote: '<strong>Lưu ý cho Dev:</strong> Bảng điều khiển chi tiết luồng web toàn diện kích thước lớn (1000px) trượt từ cạnh phải (Offcanvas End) hiển thị thông số luồng, switch bật/tắt đo lường nâng cao và danh mục cấu hình Thẻ Google.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Cần script <code>popover1.js</code> để lắng nghe sự kiện focus vào ô input và tự động ẩn popover khi người dùng nhấp chuột ra ngoài.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Menu trợ giúp nhanh kích hoạt từ icon dấu chấm hỏi với <code>dropdown-menu-end</code> và hiệu ứng bóng đổ đẹp mắt.'
            },
            {
                sampleId: 'popover-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-success',
                title: 'Analytics Variables Panel Popover (Bảng trượt điều khiển biến số phân đoạn, phương diện & chỉ số)',
                htmlFile: 'popover3.html',
                cssFile: 'popover3.css',
                jsFile: 'popover3.js',
                previewId: 'preview-popover3',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Bảng điều khiển cấu hình biến phân tích (Variables Panel) hiển thị phân đoạn, phương diện và chỉ số dạng thẻ kéo thả; có thể thu gọn xuống góc dưới thành thanh icon hoặc mở rộng toàn bộ bảng bên cạnh. Cần nhúng file <code>popover3.js</code> để đóng/mở panel.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Rê chuột vào thanh Sidebar để xem hiệu ứng mở rộng tự nhiên từ 64px thành 240px. Script <code>sidebar1.js</code> quản lý chuyển đổi trạng thái active.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Bấm vào nút mũi tên tròn ở góc dưới bên phải thanh bên để thu gọn/mở rộng. Các nhóm menu con sử dụng Accordion của Bootstrap.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Topbar tiêu chuẩn với logo Analytics động, ô chọn tài khoản, thanh tìm kiếm mở rộng và khu vực profile cá nhân. Component chỉ sử dụng HTML/CSS từ thư viện bên ngoài, không cần nhúng JavaScript bên ngoài.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Hệ thống tab khám phá nâng cao cho phép chuyển đổi loại báo cáo (Biểu mẫu tùy ý, Phễu, Khám phá người dùng...), thêm tab mới qua dropdown, xóa và nhân bản tab tức thì.'
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
                depNote: '<strong>Lưu ý cho Dev:</strong> Bảng phân tích đa chiều chuyên sâu có 2 cột cố định (checkbox & thứ nguyên), thanh công cụ tìm kiếm, chọn số hàng mỗi trang và hỗ trợ cuộn ngang mượt mà.'
            },
            {
                sampleId: 'table-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-success',
                title: 'Custom Dimensions Table (Bảng định nghĩa phương diện tuỳ chỉnh với tìm kiếm & phân trang linh hoạt)',
                htmlFile: 'table2.html',
                cssFile: 'table2.css',
                jsFile: 'table2.js',
                previewId: 'preview-table2',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Bảng hiển thị danh sách các phương diện tùy chỉnh hỗ trợ tab chuyển đổi, ô tìm kiếm lọc nhanh dữ liệu tức thì, dropdown tùy chọn số mục trên mỗi trang (10, 25, 50, 100) và các nút điều hướng phân trang. Cần nhúng file <code>table2.js</code> để kích hoạt tìm kiếm và phân trang.'
            },
            {
                sampleId: 'table-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Top Pages Table (Bảng xếp hạng trang/màn hình hàng đầu kèm thanh tỷ lệ và hover popover)',
                htmlFile: 'table3.html',
                cssFile: 'table3.css',
                jsFile: 'table3.js',
                previewId: 'preview-table3',
                previewClass: '',
                depNote: '<strong>Lưu ý cho Dev:</strong> Bảng thống kê chi tiết các trang hàng đầu (Số lượt xem, Số người dùng hoạt động, Số lượng sự kiện, Tỷ lệ thoát) tích hợp thanh tiến trình tỷ lệ trực quan (Progress Bars) và popover hiển thị số liệu chính xác khi rê chuột qua từng hàng. Cần nhúng file <code>table3.js</code> để kích hoạt hover popover.'
            }
        ]
    },
    {
        id: 'tab-breadcrumbs',
        btnId: 'tab-breadcrumbs-btn',
        title: '12. Breadcrumb Components',
        desc: 'Các mẫu Breadcrumb dạng thanh tiến trình phân bổ phân tích (Attribution Path / Touchpoints Breadcrumb)',
        icon: 'bi-chevron-bar-right text-warning',
        active: false,
        items: [
            {
                sampleId: 'breadcrumb-mau-1',
                badgeText: 'Mẫu 1',
                badgeClass: 'text-bg-warning text-dark',
                title: 'Analytics Attribution Breadcrumb (Thanh điều hướng điểm tiếp xúc phân bổ mô hình chuyển đổi)',
                htmlFile: 'breadcrumb1.html',
                cssFile: 'breadcrumb1.css',
                jsFile: null,
                previewId: 'preview-breadcrumb1',
                previewClass: 'p-4 bg-light d-flex justify-content-center',
                depNote: '<strong>Lưu ý cho Dev:</strong> Component breadcrumb thiết kế theo dạng mũi tên liên hoàn (Chevron shape) sử dụng kỹ thuật pseudo-elements <code>::before</code> và <code>::after</code> với góc xiên 45 độ, hiển thị các điểm tiếp xúc đầu, giữa và cuối kèm tỷ lệ phần trăm phân bổ.'
            },
            {
                sampleId: 'breadcrumb-mau-2',
                badgeText: 'Mẫu 2',
                badgeClass: 'text-bg-primary',
                title: 'Analytics Attribution Pill Chain (Chuỗi điểm tiếp xúc dạng thẻ bo tròn tách rời kèm tỷ lệ & nút hoàn tất)',
                htmlFile: 'breadcrumb2.html',
                cssFile: 'breadcrumb2.css',
                jsFile: null,
                previewId: 'preview-breadcrumb2',
                previewClass: 'p-4 bg-light d-flex justify-content-center',
                depNote: '<strong>Lưu ý cho Dev:</strong> Chuỗi thanh điều hướng tiến trình phân bổ chuyển đổi thiết kế dạng các thẻ pill bo tròn độc lập (border-radius: 50px), hiệu ứng hover đổi viền xanh Google (#4285f4) và nút tick hoàn thành dạng tròn nổi bật. Hỗ trợ cuộn ngang thanh cuộn mượt mà với <code>.custom-scrollbar</code>.'
            },
            {
                sampleId: 'breadcrumb-mau-3',
                badgeText: 'Mẫu 3',
                badgeClass: 'text-bg-info text-dark',
                title: 'Analytics Attribution Segmented Track (Thanh điểm tiếp xúc dạng thanh liền mạch phân đoạn kèm badge tỷ lệ)',
                htmlFile: 'breadcrumb3.html',
                cssFile: 'breadcrumb3.css',
                jsFile: null,
                previewId: 'preview-breadcrumb3',
                previewClass: 'p-4 bg-light d-flex justify-content-center',
                depNote: '<strong>Lưu ý cho Dev:</strong> Thanh tiến trình phân bổ điểm tiếp xúc thiết kế dạng track liền mạch nguyên khối (Segmented Track) chia ô bằng các đường ngăn cách <code>.s2-divider</code>, tích hợp badge tỷ lệ phần trăm bo góc và icon tick tròn hoàn tất ở cuối thanh.'
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
        if (item.sampleId === 'card-mau-4') {
            previewHtml = previewHtml
                .replace(/viewBox="0 0 1000 300"/g, 'viewBox="0 0 1025 300"')
                .replace(/x2="950"/g, 'x2="975"')
                .replace(/<text x="965"/g, '<text x="982"');
        }
        if (item.sampleId === 'card-mau-8') {
            previewHtml = previewHtml
                .replace(/id="interactiveLayer"/g, 'id="interactiveLayer8"')
                .replace(/id="chartTooltip"/g, 'id="chartTooltip8"')
                .replace(/id="ttDate"/g, 'id="ttDate8"')
                .replace(/id="ttContent"/g, 'id="ttContent8"')
                .replace(/id="mainChart"/g, 'id="mainChart8"');
        }
        if (item.sampleId === 'card-mau-10') {
            previewHtml = previewHtml
                .replace(/id="btnDim1"/g, 'id="btnDim1_10"')
                .replace(/id="menuDim1"/g, 'id="menuDim1_10"')
                .replace(/id="btnDim2"/g, 'id="btnDim2_10"')
                .replace(/id="menuDim2"/g, 'id="menuDim2_10"');
        }
        if (item.sampleId === 'card-mau-11') {
            previewHtml = previewHtml
                .replace(/id="metricTrack"/g, 'id="metricTrack11"')
                .replace(/id="metricPrevBtn"/g, 'id="metricPrevBtn11"')
                .replace(/id="metricNextBtn"/g, 'id="metricNextBtn11"')
                .replace(/id="metricContainer"/g, 'id="metricContainer11"')
                .replace(/id="interactiveLayer"/g, 'id="interactiveLayer11"')
                .replace(/id="chartPopover"/g, 'id="chartPopover11"')
                .replace(/id="popDate"/g, 'id="popDate11"')
                .replace(/id="popName"/g, 'id="popName11"')
                .replace(/id="popVal"/g, 'id="popVal11"')
                .replace(/id="popTrend"/g, 'id="popTrend11"');
        }
        if (item.sampleId === 'card-mau-12') {
            previewHtml = previewHtml
                .replace(/id="chartPopover"/g, 'id="chartPopover12"')
                .replace(/id="popDate"/g, 'id="popDate12"')
                .replace(/id="popName"/g, 'id="popName12"')
                .replace(/id="popVal"/g, 'id="popVal12"')
                .replace(/id="popTrend"/g, 'id="popTrend12"');
        }
        if (item.sampleId === 'card-mau-13') {
            previewHtml = previewHtml
                .replace(/id="interactiveLayer"/g, 'id="interactiveLayer13"')
                .replace(/id="chartPopover"/g, 'id="chartPopover13"')
                .replace(/id="popDate"/g, 'id="popDate13"')
                .replace(/id="pop30"/g, 'id="pop30_13"')
                .replace(/id="pop7"/g, 'id="pop7_13"')
                .replace(/id="pop1"/g, 'id="pop1_13"');
        }
        if (item.sampleId === 'table-mau-2') {
            previewHtml = previewHtml
                .replace(/id="searchInput"/g, 'id="searchInputTable2"')
                .replace(/id="dataTable"/g, 'id="dataTable2"')
                .replace(/id="tableBody"/g, 'id="tableBody2"')
                .replace(/id="noDataMessage"/g, 'id="noDataMessage2"')
                .replace(/id="rowsPerPageText"/g, 'id="rowsPerPageText2"')
                .replace(/id="firstPageBtn"/g, 'id="firstPageBtn2"')
                .replace(/id="prevPageBtn"/g, 'id="prevPageBtn2"')
                .replace(/id="nextPageBtn"/g, 'id="nextPageBtn2"')
                .replace(/id="lastPageBtn"/g, 'id="lastPageBtn2"')
                .replace(/id="pageInfo"/g, 'id="pageInfo2"');
        }
        if (item.sampleId === 'popover-mau-1') {
            previewHtml = previewHtml
                .replace(/id="searchInput"/g, 'id="searchInputPopover1"')
                .replace(/id="searchBoxTrigger"/g, 'id="searchBoxTriggerPopover1"')
                .replace(/id="searchPopover"/g, 'id="searchPopoverPopover1"');
        }
        const cssContent = item.cssFile ? fs.readFileSync(path.join(DIR, item.cssFile), 'utf-8') : '';
        const jsContent = item.jsFile ? fs.readFileSync(path.join(DIR, item.jsFile), 'utf-8') : '';

        // Tự động phân tích và trích xuất đúng thư viện bên ngoài từ chính file HTML của mẫu
        const extDeps = extractExternalDependencies(rawHtml);

        // Generate dep badges dựa trên thư viện thực tế có trong file HTML
        let badgesHtml = extDeps.badges.map(b => {
            const cls = b.type === 'req' ? 'dep-badge-req' : 'dep-badge-rec';
            const ico = b.type === 'req' ? 'bi-check-circle-fill' : 'bi-info-circle';
            return `<span class="dep-badge-pill ${cls}"><i class="bi ${ico}"></i> ${b.text}</span>`;
        }).join('\n                                        ');

        // Test template chỉ chứa đúng các liên kết / script bên ngoài của mẫu đó
        const templateLinksHtml = extDeps.links.length > 0 ? extDeps.links.join('\n    ') : '';
        const templateScriptsHtml = extDeps.scripts.length > 0 ? extDeps.scripts.join('\n    ') : '';

        let testTemplateHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test ${item.title.split('(')[0].trim()}</title>
    ${templateLinksHtml}
    <style>
/* Dán CSS ${item.cssFile || ''} vào đây */
    </style>
</head>
<body class="p-4 bg-light">
    <!-- Dán HTML của component vào đây -->
    ${templateScriptsHtml}
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
                                        <pre><code id="${depCodeId}">${escapeHtml(extDeps.code)}</code></pre>
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
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

    <!-- CSS từng Component -->
    <link rel="stylesheet" href="accordion1.css">
    <link rel="stylesheet" href="accordion2.css">
    <link rel="stylesheet" href="accordion3.css">
    <link rel="stylesheet" href="accordion4.css">
    <link rel="stylesheet" href="accordion5.css">
    <link rel="stylesheet" href="card1.css">
    <link rel="stylesheet" href="card2.css">
    <link rel="stylesheet" href="card3.css">
    <link rel="stylesheet" href="card4.css">
    <link rel="stylesheet" href="card5.css">
    <link rel="stylesheet" href="card6.css">
    <link rel="stylesheet" href="card7.css">
    <link rel="stylesheet" href="card8.css">
    <link rel="stylesheet" href="card9.css">
    <link rel="stylesheet" href="card10.css">
    <link rel="stylesheet" href="card11.css">
    <link rel="stylesheet" href="card12.css">
    <link rel="stylesheet" href="card13.css">
    <link rel="stylesheet" href="card14.css">
    <link rel="stylesheet" href="card15.css">
    <link rel="stylesheet" href="card16.css">
    <link rel="stylesheet" href="card17.css">
    <link rel="stylesheet" href="card18.css">
    <link rel="stylesheet" href="card19.css">
    <link rel="stylesheet" href="card20.css">
    <link rel="stylesheet" href="carousel1.css">
    <link rel="stylesheet" href="carousel2.css">
    <link rel="stylesheet" href="carousel3.css">
    <link rel="stylesheet" href="dropdown1.css">
    <link rel="stylesheet" href="dropdown2.css">
    <link rel="stylesheet" href="dropdown3.css">
    <link rel="stylesheet" href="dropdown4.css">
    <link rel="stylesheet" href="modal1.css">
    <link rel="stylesheet" href="modal2.css">
    <link rel="stylesheet" href="modal3.css">
    <link rel="stylesheet" href="offcanvas1.css">
    <link rel="stylesheet" href="offcanvas2.css">
    <link rel="stylesheet" href="offcanvas3.css">
    <link rel="stylesheet" href="offcanvas4.css">
    <link rel="stylesheet" href="offcanvas5.css">
    <link rel="stylesheet" href="popover1.css">
    <link rel="stylesheet" href="popover2.css">
    <link rel="stylesheet" href="popover3.css">
    <link rel="stylesheet" href="sidebar1.css">
    <link rel="stylesheet" href="sidebar2.css">
    <link rel="stylesheet" href="table1.css">
    <link rel="stylesheet" href="table2.css">
    <link rel="stylesheet" href="table3.css">
    <link rel="stylesheet" href="tabs1.css">
    <link rel="stylesheet" href="topbar1.css">
    <link rel="stylesheet" href="breadcrumb1.css">
    <link rel="stylesheet" href="breadcrumb2.css">
    <link rel="stylesheet" href="breadcrumb3.css">

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
