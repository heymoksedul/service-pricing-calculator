jQuery(document).ready(function($) {
    const wrapper = document.getElementById('pp-calculator-wrapper');
    if (!wrapper) return;

    const services = ppData.services || [];
    const defaultVariants = [
        {id: 'simple', name: 'Simple'},
        {id: 'medium', name: 'Medium'},
        {id: 'complex', name: 'Complex'}
    ];

    if (services.length === 0) {
        wrapper.innerHTML = '<p>No services options available.</p>';
        return;
    }

    // Render Markup
    wrapper.innerHTML = `
        <div class="pp-calc-left">
            <div class="pp-service-header">
                <div class="pp-header-top">
                    <h3 id="pp-header-title"></h3>
                    <span id="pp-header-price" class="pp-price-tag">$0.00</span>
                </div>
                <p id="pp-header-desc"></p>
            </div>

            <img id="pp-preview-img" src="" alt="" class="service-preview-img" style="display:none;">
            <div class="pp-qa-section">
                <h4 id="pp-qa-question"></h4>
                <p id="pp-qa-answer"></p>
            </div>
        </div>
        <div class="pp-calc-right">
            <div class="form-group">
                <label>Services:</label>
                <select id="pp-service-select" class="pp-select"></select>
            </div>
            
            <div class="form-group">
                <label>Turnaround Time</label>
                <input type="range" id="pp-turnaround-range" min="0" max="4" step="1" value="2">
                <div class="turnaround-labels">
                    <span>12h</span><span>24h</span><span>48h</span><span>72h</span><span>More</span>
                </div>
            </div>

            <div class="form-group">
                <label>Complexity</label>
                <div class="complexity-buttons" id="pp-complexity-btns">
                    <!-- Dynamic Buttons -->
                </div>
            </div>

            <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="pp-quantity" min="1" value="1" class="pp-input">
            </div>

            <button id="pp-calc-btn" class="pp-calculate-btn">Calculate</button>
        </div>

        <div id="pp-result" class="pp-result-area" style="display:none; width: 100%; flex-basis: 100%;">
            <div class="pp-result-table">
                <div class="pp-result-row header">
                    <span>Service</span><span>Turnaround</span><span>Complexity</span><span>Qty</span><span>Unit Price</span><span>Total</span>
                </div>
                <div class="pp-result-row value-row">
                    <!-- Values here -->
                </div>
            </div>
            <div class="pp-result-actions" style="margin-top: 20px; text-align: right;">
                <a href="/free-trail" class="pp-free-trial-btn">Start Free Trial</a>
            </div>
        </div>
    `;

    // Elements
    const serviceSelect = document.getElementById('pp-service-select');
    const rangeInput = document.getElementById('pp-turnaround-range');
    const complexityBtns = document.getElementById('pp-complexity-btns');
    const quantityInput = document.getElementById('pp-quantity');
    const calcBtn = document.getElementById('pp-calc-btn');
    const resultBox = document.getElementById('pp-result');
    
    const previewImg = document.getElementById('pp-preview-img');
    const qaQuestion = document.getElementById('pp-qa-question');
    const qaAnswer = document.getElementById('pp-qa-answer');

    // Turnaround Map
    const TURNAROUND_MAP = [
        { label: '12h', mult: 2.0 },
        { label: '24h', mult: 1.5 },
        { label: '48h', mult: 1.0 },
        { label: '72h', mult: 0.8 },
        { label: 'More', mult: 0.7 }
    ];

    // State
    let currentServiceId = services.length > 0 ? services[0].id : null;
    let currentComplexity = null;

    // Init Services
    services.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.title;
        serviceSelect.appendChild(opt);
    });

    function renderComplexityButtons() {
        const service = services.find(s => s.id === currentServiceId);
        if (!service) return;

        const svcVariants = service.variants || defaultVariants;
        complexityBtns.innerHTML = '';
        
        svcVariants.forEach((v, index) => {
            const btn = document.createElement('button');
            btn.className = index === 0 ? 'complexity-btn active' : 'complexity-btn';
            btn.dataset.level = v.id;
            btn.textContent = v.name;
            btn.addEventListener('click', () => {
                $(complexityBtns).find('button').removeClass('active');
                btn.classList.add('active');
                currentComplexity = v.id;
                updateUI();
            });
            complexityBtns.appendChild(btn);
            if (index === 0) currentComplexity = v.id;
        });
    }

    // Update UI Function
    function updateUI() {
        const service = services.find(s => s.id === currentServiceId);
        if (!service) return;

        const compData = (service.complexities && service.complexities[currentComplexity]) || {};
        
        // Update Header
        document.getElementById('pp-header-title').textContent = service.title || '';
        document.getElementById('pp-header-desc').textContent = service.short_description || '';
        
        const priceVal = parseFloat(compData.price) || 0;
        document.getElementById('pp-header-price').textContent = '$' + priceVal.toFixed(2);

        // Update Image
        if (compData.image) {
            previewImg.src = compData.image;
            previewImg.style.display = 'block';
        } else {
            previewImg.style.display = 'none';
        }

        // Update Q&A
        qaQuestion.textContent = compData.qa_question || '';
        qaAnswer.textContent = compData.qa_answer || '';
    }

    // Event Listeners
    serviceSelect.addEventListener('change', (e) => {
        currentServiceId = e.target.value;
        renderComplexityButtons();
        updateUI();
    });

    calcBtn.addEventListener('click', () => {
        const service = services.find(s => s.id === currentServiceId);
        if (!service) return;

        const svcVariants = service.variants || defaultVariants;
        const compData = (service.complexities && service.complexities[currentComplexity]) || {};
        const variant = svcVariants.find(v => v.id === currentComplexity);
        const basePrice = parseFloat(compData.price) || 0;
        
        const turnIdx = parseInt(rangeInput.value);
        const turnData = TURNAROUND_MAP[turnIdx];
        
        const qty = parseInt(quantityInput.value) || 1;
        
        const unitPrice = basePrice * turnData.mult;
        const total = unitPrice * qty;

        const row = resultBox.querySelector('.value-row');
        row.innerHTML = `
            <span>${service.title}</span>
            <span>${turnData.label}</span>
            <span>${variant ? variant.name : ''}</span>
            <span>${qty}</span>
            <span>$${unitPrice.toFixed(2)}</span>
            <span>$${total.toFixed(2)}</span>
        `;
        resultBox.style.display = 'block';
    });

    // Initial Load
    if (currentServiceId) {
        renderComplexityButtons();
        updateUI();
    }
});
