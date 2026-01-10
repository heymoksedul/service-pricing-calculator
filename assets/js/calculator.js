jQuery(document).ready(function($) {
    $('.pp-calculator-wrapper').each(function() {
        const wrapper = $(this);
        const type = wrapper.data('type') || 'full';
        wrapper.addClass('pp-mode-' + type);
        const initialServiceName = wrapper.data('service') || '';
        const services = ppData.services || [];
        const defaultVariants = [
            {id: 'simple', name: 'Simple'},
            {id: 'medium', name: 'Medium'},
            {id: 'complex', name: 'Complex'}
        ];

        if (services.length === 0) {
            wrapper.html('<p>No services options available.</p>');
            return;
        }

        // Render Skeleton based on type
        if (type === 'simple') {
            wrapper.html(`
                <div class="pp-calculator-simple">
                    <div class="form-group">
                        <select class="pp-service-select pp-select"></select>
                    </div>
                    <div class="form-group">
                        <select class="pp-complexity-select pp-select"></select>
                    </div>
                    <div class="form-group">
                        <input type="number" class="pp-quantity pp-input" min="1" value="1" placeholder="Quantity">
                    </div>
                    <button class="pp-calc-btn pp-calculate-btn">Calculate</button>
                    <div class="pp-simple-result" style="display:none; margin-top:15px; text-align:center; font-weight:700; color:#1e293b; font-size:18px;">
                        Total Price: <span class="pp-total-val">$0.00</span>
                    </div>
                </div>
            `);
        } else {
            wrapper.html(`
                <div class="pp-calc-left">
                    <div class="pp-service-header">
                        <div class="pp-header-top">
                            <h3 class="pp-header-title"></h3>
                            <span class="pp-header-price pp-price-tag">$0.00</span>
                        </div>
                        <p class="pp-header-desc"></p>
                    </div>
                    <img class="service-preview-img pp-preview-img" src="" alt="" style="display:none;">
                    <div class="pp-qa-section">
                        <h4 class="pp-qa-question"></h4>
                        <p class="pp-qa-answer"></p>
                    </div>
                </div>
                <div class="pp-calc-right">
                    <div class="form-group">
                        <label>Services:</label>
                        <select class="pp-service-select pp-select"></select>
                    </div>
                    <div class="form-group">
                        <label>Turnaround Time</label>
                        <input type="range" class="pp-turnaround-range" min="0" max="4" step="1" value="2">
                        <div class="turnaround-labels">
                            <span>12h</span><span>24h</span><span>48h</span><span>72h</span><span>More</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Complexity</label>
                        <select class="pp-complexity-select pp-select"></select>
                    </div>
                    <div class="form-group">
                        <label>Quantity</label>
                        <input type="number" class="pp-quantity pp-input" min="1" value="1">
                    </div>
                    <button class="pp-calc-btn pp-calculate-btn">Calculate</button>
                </div>
                <div class="pp-result pp-result-area" style="display:none; width: 100%; flex-basis: 100%;">
                    <div class="pp-result-table">
                        <div class="pp-result-row header">
                            <span>Service</span><span>Turnaround</span><span>Complexity</span><span>Qty</span><span>Unit Price</span><span>Total</span>
                        </div>
                        <div class="pp-result-row value-row"></div>
                    </div>
                    <div class="pp-result-actions" style="margin-top: 20px; text-align: right;">
                        <a href="/free-trail" class="pp-free-trial-btn">Start Free Trial</a>
                    </div>
                </div>
            `);
        }

        // Cached Elements
        const serviceSelect = wrapper.find('.pp-service-select');
        const complexitySelect = wrapper.find('.pp-complexity-select');
        const quantityInput = wrapper.find('.pp-quantity');
        const calcBtn = wrapper.find('.pp-calc-btn');
        const resultArea = type === 'simple' ? wrapper.find('.pp-simple-result') : wrapper.find('.pp-result');
        const turnaroundRange = wrapper.find('.pp-turnaround-range');

        // Turnaround Map
        const TURNAROUND_MAP = [
            { label: '12h', mult: 2.0 },
            { label: '24h', mult: 1.5 },
            { label: '48h', mult: 1.0 },
            { label: '72h', mult: 0.8 },
            { label: 'More', mult: 0.7 }
        ];

        // State
        let currentServiceId = null;
        let currentComplexityId = null;

        // Init Services Dropdown
        services.forEach(s => {
            const opt = $('<option>').val(s.id).text(s.title);
            serviceSelect.append(opt);
        });

        // Respect Pre-selected Service Attribute
        if (initialServiceName) {
            const matched = services.find(s => s.title.toLowerCase() === initialServiceName.toLowerCase());
            if (matched) serviceSelect.val(matched.id);
        }
        currentServiceId = serviceSelect.val();

        function renderComplexity() {
            const service = services.find(s => s.id === currentServiceId);
            if (!service) return;

            const svcVariants = (service.variants && service.variants.length > 0) ? service.variants : defaultVariants;
            complexitySelect.empty();

            svcVariants.forEach((v, index) => {
                const opt = $('<option>').val(v.id).text(v.name);
                complexitySelect.append(opt);
                if (index === 0) currentComplexityId = v.id;
            });
        }

        function updateUI() {
            if (type === 'simple') return;

            const service = services.find(s => s.id === currentServiceId);
            if (!service) return;

            const compData = (service.complexities && service.complexities[currentComplexityId]) || {};
            
            wrapper.find('.pp-header-title').text(service.title || '');
            wrapper.find('.pp-header-desc').text(service.short_description || '');
            
            const priceVal = parseFloat(compData.price) || 0;
            wrapper.find('.pp-header-price').text('$' + priceVal.toFixed(2));

            const previewImg = wrapper.find('.pp-preview-img');
            if (compData.image) {
                previewImg.attr('src', compData.image).show();
            } else {
                previewImg.hide();
            }

            wrapper.find('.pp-qa-question').text(compData.qa_question || '');
            wrapper.find('.pp-qa-answer').text(compData.qa_answer || '');
        }

        // Listeners
        serviceSelect.on('change', function() {
            currentServiceId = $(this).val();
            renderComplexity();
            updateUI();
        });

        complexitySelect.on('change', function() {
            currentComplexityId = $(this).val();
            if (type !== 'simple') {
                updateUI();
            }
        });

        calcBtn.on('click', function() {
            const service = services.find(s => s.id === currentServiceId);
            if (!service) return;

            const compData = (service.complexities && service.complexities[currentComplexityId]) || {};
            const basePrice = parseFloat(compData.price) || 0;
            const qty = parseInt(quantityInput.val()) || 1;

            if (type === 'simple') {
                const total = basePrice * qty;
                resultArea.find('.pp-total-val').text('$' + total.toFixed(2));
                resultArea.fadeIn();
            } else {
                const turnIdx = parseInt(turnaroundRange.val());
                const turnData = TURNAROUND_MAP[turnIdx];
                const unitPrice = basePrice * turnData.mult;
                const total = unitPrice * qty;

                const svcVariants = (service.variants && service.variants.length > 0) ? service.variants : defaultVariants;
                const variant = svcVariants.find(v => v.id === currentComplexityId);

                wrapper.find('.value-row').html(`
                    <span>${service.title}</span>
                    <span>${turnData.label}</span>
                    <span>${variant ? variant.name : ''}</span>
                    <span>${qty}</span>
                    <span>$${unitPrice.toFixed(2)}</span>
                    <span>$${total.toFixed(2)}</span>
                `);
                resultArea.fadeIn();
            }
        });

        // Init
        renderComplexity();
        updateUI();
    });
});
