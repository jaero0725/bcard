// Swiper 초기화
document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.cardSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 600,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    const cardsWrapper = document.querySelector('.cards-wrapper');
    const cards = document.querySelectorAll('.ai-business-card');
    
    // 전체 높이 계산
    let totalHeight = 0;
    cards.forEach(card => {
        totalHeight += card.offsetHeight + 40;
    });
    
    // cards-wrapper 높이 설정
    cardsWrapper.style.height = `${totalHeight}px`;
    
    // 초기 카드 복제
    const originalCards = cardsWrapper.innerHTML;
    cardsWrapper.innerHTML = originalCards + originalCards;
    
    // 애니메이션 시작
    setTimeout(() => {
        cardsWrapper.classList.add('animate');
    }, 2000);
    
    // 애니메이션 무한 반복 처리
    function resetAnimation() {
        cardsWrapper.style.animation = 'none';
        cardsWrapper.offsetHeight; // reflow
        cardsWrapper.style.animation = 'slideDown 15s linear infinite';
    }

    cardsWrapper.addEventListener('animationend', resetAnimation);
    
    // 마우스 호버 시 애니메이션 제어
    const container = document.querySelector('.cards-container');
    
    container.addEventListener('mouseenter', () => {
        cardsWrapper.style.animationPlayState = 'paused';
    });
    
    container.addEventListener('mouseleave', () => {
        cardsWrapper.style.animationPlayState = 'running';
    });

    // QR 코드 생성
    document.querySelectorAll('#qrCode').forEach(element => {
        new QRCode(element, {
            text: "https://www.google.com/about/careers/applications/teams/cloud-ai",
            width: 64,
            height: 64,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    });

    let currentIndex = 0;
    let isAnimating = false;

    function showCard(index) {
        if (isAnimating) return;
        isAnimating = true;

        // 현재 카드 페이드 아웃
        const currentCard = document.querySelector('.business-card.active');
        if (currentCard) {
            currentCard.style.opacity = '0';
            currentCard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                currentCard.classList.remove('active');
                currentCard.style.visibility = 'hidden';
            }, 600);
        }

        // 새 카드 페이드 인
        setTimeout(() => {
            cards[index].style.visibility = 'visible';
            cards[index].classList.add('active');
            cards[index].style.opacity = '1';
            cards[index].style.transform = 'translateY(0)';
            isAnimating = false;
        }, 700);
    }

    function nextCard() {
        currentIndex = (currentIndex + 1) % cards.length;
        showCard(currentIndex);
    }

    // 초기 카드 표시
    showCard(0);

    // 자동 전환
    let autoPlayInterval = setInterval(nextCard, 5000);

    // 마우스 호버 시 일시 정지
    const container = document.querySelector('.cards-container');
    container.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    container.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextCard, 5000);
    });

    // 카드에 클릭 이벤트 추가 (선택사항)
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (!isAnimating && index !== currentIndex) {
                currentIndex = index;
                showCard(currentIndex);
            }
        });
    });

    // 카드 호버 효과
    const card = document.querySelector('.ai-business-card');
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = -(x - centerX) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.5s ease';
    });
});

function checkCardsVisibility() {
    const cards = document.querySelectorAll('.card-wrapper');
    
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // 카드가 화면의 80% 지점에 도달하면 표시
        if (cardTop < windowHeight * 0.8) {
            card.classList.add('visible');
        }
    });
}

// 페이지 새로고침 시 스크롤 위치 초기화 (선택사항)
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
};
