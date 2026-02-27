// Sample Employee Data
const employeeData = {
    name: "Sarah Johnson",
    employeeId: "EMP-2024-001",
    email: "sarah.johnson@company.com",
    department: "Software Development",
    designation: "Senior Software Engineer",
    dateOfJoining: "January 15, 2021",
    workDetails: "Responsible for developing and maintaining enterprise-level web applications. Leading a team of 5 developers on the company's flagship product. Expertise in full-stack development with focus on React, Node.js, and cloud technologies.",
    currentProject: "Enterprise CRM System v3.0",
    totalProjects: 15,
    projectsCompleted: 13,
    performanceRating: 4.5, // Out of 5
    promotionProbability: 85 // Percentage
};


function calculateCompletionRate(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
}


function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    
    
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
   
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}


function getPromotionLabel(probability) {
    if (probability >= 75) {
        return { text: "High Probability", class: "high" };
    } else if (probability >= 50) {
        return { text: "Medium Probability", class: "medium" };
    } else {
        return { text: "Low Probability", class: "low" };
    }
}


function updatePromotionCircle(probability) {
    const circle = document.getElementById('promotionProgress');
    const circumference = 314; 
    const offset = circumference - (probability / 100) * circumference;
    
    
    if (!document.querySelector('#gradient')) {
        const svg = circle.closest('svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.innerHTML = `
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        `;
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
    
    circle.style.strokeDashoffset = offset;
}


function populateDashboard() {
    
    document.getElementById('employeeName').textContent = employeeData.name;
    document.getElementById('employeeId').textContent = employeeData.employeeId;
    document.getElementById('employeeEmail').textContent = employeeData.email;
    document.getElementById('department').textContent = employeeData.department;
    document.getElementById('designation').textContent = employeeData.designation;
    document.getElementById('dateOfJoining').textContent = employeeData.dateOfJoining;
    
    
    document.getElementById('workDetails').textContent = employeeData.workDetails;
    
    document.getElementById('currentProject').textContent = employeeData.currentProject;
    document.getElementById('totalProjects').textContent = employeeData.totalProjects;
    document.getElementById('projectsCompleted').textContent = employeeData.projectsCompleted;
    
    const completionRate = calculateCompletionRate(
        employeeData.projectsCompleted, 
        employeeData.totalProjects
    );
    document.getElementById('completionRate').textContent = completionRate + '%';
    
    document.getElementById('performanceRating').innerHTML = 
        generateStarRating(employeeData.performanceRating);
    document.getElementById('ratingValue').textContent = 
        employeeData.performanceRating.toFixed(1);
    
    const ratingPercentage = (employeeData.performanceRating / 5) * 100;
    document.getElementById('ratingProgress').style.width = ratingPercentage + '%';
    
    document.getElementById('promotionProbability').textContent = 
        employeeData.promotionProbability + '%';
    
    const promotionLabel = getPromotionLabel(employeeData.promotionProbability);
    const labelElement = document.getElementById('promotionLabel');
    labelElement.textContent = promotionLabel.text;
    labelElement.className = 'probability-label ' + promotionLabel.class;
    
    updatePromotionCircle(employeeData.promotionProbability);
    
    animateNumbers();

    const sidebarTotal = document.getElementById('sidebarTotalProjects');
    if (sidebarTotal) sidebarTotal.textContent = employeeData.totalProjects;

    const sidebarCompleted = document.getElementById('sidebarProjectsCompleted');
    if (sidebarCompleted) sidebarCompleted.textContent = employeeData.projectsCompleted;

    const sidebarRate = document.getElementById('sidebarCompletionRate');
    if (sidebarRate) sidebarRate.textContent = completionRate + '%';

    const sidebarRating = document.getElementById('sidebarRatingValueSmall');
    if (sidebarRating) sidebarRating.textContent = employeeData.performanceRating.toFixed(1);

    const sidebarPromotion = document.getElementById('sidebarPromotionProbability');
    if (sidebarPromotion) sidebarPromotion.textContent = employeeData.promotionProbability + '%';
}


function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const finalValue = parseInt(text);
        
        if (!isNaN(finalValue)) {
            let currentValue = 0;
            const increment = finalValue / 30; // 30 frames for animation
            const duration = 1000; // 1 second
            const frameTime = duration / 30;
            
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    element.textContent = finalValue + (isPercentage ? '%' : '');
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(currentValue) + (isPercentage ? '%' : '');
                }
            }, frameTime);
        }
    });
}

function refreshDashboard() {
    const refreshBtn = document.querySelector('.btn-refresh i');
    refreshBtn.style.animation = 'spin 1s ease';
    
    setTimeout(() => {
        refreshBtn.style.animation = '';
        populateDashboard();
        
        console.log('Dashboard refreshed successfully!');
    }, 1000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    populateDashboard();
});

