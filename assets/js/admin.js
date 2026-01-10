jQuery(document).ready(function($) {
    const tableBody = $('#pp-services-table-body');
    const modal = $('#pp-modal-overlay');
    const searchInput = $('#pp-service-search');
    
    // State
    let services = ppData.services || [];
    let currentVariants = [];
    const defaultVariants = [
        {id: 'simple', name: 'Simple'}
    ];

    // --- RENDER TABLE ---
    function renderTable(filter = '') {
        tableBody.empty();
        
        const filtered = services.filter(s => 
            (s.title || '').toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            $('.no-services-msg').show();
            return;
        }
        $('.no-services-msg').hide();

        filtered.forEach((service, index) => {
            const svcVariants = service.variants || defaultVariants;
            
            // Get image from first variant's complexity data
            const firstVariantId = svcVariants[0]?.id;
            const firstVariantData = (service.complexities?.[firstVariantId]) || {};
            const thumbUrl = firstVariantData.image;
            
            const thumbHtml = thumbUrl 
                ? `<img src="${thumbUrl}" class="pp-thumb">`
                : `<div class="pp-thumb-placeholder"><span class="dashicons dashicons-format-image"></span></div>`;

            let pricingHtml = '<div class="pp-pricing-badges">';
            svcVariants.forEach(v => {
                const priceData = (service.complexities?.[v.id]) || {};
                const price = priceData.price || '0';
                pricingHtml += `<span class="pp-badge">${v.name}: $${price}</span>`;
            });
            pricingHtml += '</div>';

            const row = `
                <tr data-id="${service.id}">
                    <td class="pp-id-col">${index + 1}</td>
                    <td class="pp-thumb-cell">${thumbHtml}</td>
                    <td><a href="#" class="pp-service-name pp-edit-trigger">${service.title || '(No Title)'}</a></td>
                    <td>${pricingHtml}</td>
                    <td>
                        <div style="display:flex; align-items:center;">
                            <span class="dashicons dashicons-edit pp-action-icon pp-icon-edit pp-edit-trigger"></span>
                            <span class="dashicons dashicons-trash pp-action-icon pp-icon-delete pp-delete-trigger"></span>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    // --- SEARCH ---
    searchInput.on('input', function() {
        renderTable($(this).val());
    });

    // --- SERVICE MODAL ACTIONS ---
    function buildModalStructure() {
        const nav = $('#pp-complexity-nav');
        const container = $('#pp-complexity-container');
        nav.empty();
        container.empty();
    
        currentVariants.forEach((v, index) => {
            const isActive = index === 0 ? 'active' : '';
            const display = index === 0 ? '' : 'display:none;';
    
            nav.append(`
                <button type="button" class="pp-nav-btn ${isActive}" data-target="${v.id}">
                    <span class="pp-v-name-text">${v.name}</span>
                </button>
            `);
            
            container.append(`
                <div class="pp-complexity-pane" data-level="${v.id}" style="${display}">
                    <div class="pp-pane-header">
                        <div style="display:flex; gap:10px; align-items:center;">
                            <label class="pp-label" style="margin:0;">Variant Name:</label>
                            <input type="text" class="pp-input pp-variant-name-input" value="${v.name}" data-id="${v.id}" style="max-width:200px; font-weight:600;">
                        </div>
                        <button type="button" class="pp-delete-variant-btn" data-id="${v.id}">Remove Variant</button>
                    </div>

                    <div class="pp-cols">
                        <div class="pp-form-row">
                            <label class="pp-label">Base Price ($)</label>
                            <input type="number" step="0.01" class="pp-input pp-input-price" value="${v.price || ''}" placeholder="0.00">
                        </div>
                        <div class="pp-form-row">
                            <label class="pp-label">Visual Preview</label>
                            <div class="pp-upload-card">
                                <input type="hidden" class="pp-input-image" value="${v.image || ''}">
                                <div class="pp-upload-preview">
                                    ${v.image ? `<img src="${v.image}">` : '<div style="font-size:12px; color:#94a3b8; margin-bottom:10px;">(No Image)</div>'}
                                </div>
                                <button type="button" class="pp-upload-trigger pp-btn pp-btn-secondary" style="font-size: 11px; padding: 4px 8px;">
                                    ${v.image ? 'Change' : 'Select'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pp-form-section" style="margin-top:20px;">
                        <div class="pp-section-title">Customer Q&A</div>
                        <div class="pp-form-row">
                            <label class="pp-label">Question</label>
                            <input type="text" class="pp-input pp-input-question" value="${v.qa_question || ''}" placeholder="e.g. What defines this tier?">
                        </div>
                        <div class="pp-form-row">
                            <label class="pp-label">Answer</label>
                            <textarea class="pp-textarea" rows="2" placeholder="Describe the complexity...">${v.qa_answer || ''}</textarea>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Capture textarea manually since I missed the class earlier
    function syncCurrentData() {
        currentVariants.forEach(v => {
            const pane = $(`.pp-complexity-pane[data-level="${v.id}"]`);
            if (pane.length) {
                v.price = pane.find('.pp-input-price').val();
                v.qa_question = pane.find('.pp-input-question').val();
                // Find textarea specifically
                v.qa_answer = pane.find('textarea').val();
                v.image = pane.find('.pp-input-image').val();
            }
        });
    }

    function openModal(service = null) {
        const rawVariants = (service && service.variants) ? service.variants : defaultVariants;
        currentVariants = rawVariants.map(v => {
            const extra = (service && service.complexities && service.complexities[v.id]) || {};
            return {
                id: v.id,
                name: v.name,
                price: extra.price || '',
                qa_question: extra.qa_question || '',
                qa_answer: extra.qa_answer || '',
                image: extra.image || ''
            };
        });
        
        buildModalStructure();

        $('#pp-edit-id').val(service ? service.id : '');
        $('#pp-edit-title').val(service ? service.title : '');
        $('#pp-edit-desc').val(service ? service.short_description : '');
        $('#pp-modal-title').text(service ? 'Service Settings' : 'Create New Service');

        modal.fadeIn(250);
    }

    function saveService() {
        syncCurrentData();
        const idVal = $('#pp-edit-id').val();
        const isNew = !idVal;
        
        const newService = {
            id: idVal || 'svc_' + Date.now(),
            title: $('#pp-edit-title').val(),
            short_description: $('#pp-edit-desc').val(),
            variants: currentVariants.map(v => ({ id: v.id, name: v.name })),
            complexities: {}
        };

        currentVariants.forEach(v => {
            newService.complexities[v.id] = {
                id: v.id,
                name: v.name,
                price: v.price,
                qa_question: v.qa_question,
                qa_answer: v.qa_answer,
                image: v.image
            };
        });

        if (isNew) {
            services.push(newService);
        } else {
            services = services.map(s => s.id === newService.id ? newService : s);
        }

        const btn = $('#pp-modal-save');
        btn.prop('disabled', true).text('Synthesizing...');
        
        $.post(ppData.ajaxUrl, {
            action: 'pp_save_services',
            nonce: ppData.nonce,
            services: JSON.stringify(services)
        }, function(res) {
            btn.prop('disabled', false).text('Save Service');
            if(res.success) {
                renderTable();
                modal.fadeOut(250);
            } else {
                alert('Connection failure. Data not saved.');
            }
        });
    }

    // --- EVENTS ---
    $(document).on('click', '#pp-add-variant-btn', function(e) {
        e.preventDefault();
        syncCurrentData();
        const newId = 'var_' + Date.now();
        currentVariants.push({ id: newId, name: 'Premium Variant', price: '', qa_question: '', qa_answer: '', image: '' });
        buildModalStructure();
        $('.pp-nav-btn').removeClass('active').last().addClass('active');
        $('.pp-complexity-pane').hide().last().show();
    });

    $(document).on('click', '.pp-delete-variant-btn', function(e) {
        e.preventDefault();
        const btn = $(this);
        const id = String(btn.attr('data-id'));
        if (currentVariants.length <= 1) {
            alert('At least one tier is required for calculation.');
            return;
        }
        if (!btn.hasClass('pp-confirming')) {
            btn.addClass('pp-confirming').text('CONFIRM');
            setTimeout(() => {
                btn.removeClass('pp-confirming').text('Delete Variant');
            }, 3000);
            return;
        }
        syncCurrentData();
        currentVariants = currentVariants.filter(v => String(v.id) !== id);
        buildModalStructure();
    });

    $(document).on('input', '.pp-variant-name-input', function() {
        const id = String($(this).attr('data-id'));
        const newName = $(this).val();
        const v = currentVariants.find(v => String(v.id) === id);
        if (v) {
            v.name = newName;
            $(`.pp-nav-btn[data-target="${id}"] .pp-v-name-text`).text(newName);
        }
    });

    $(document).on('click', '.pp-nav-btn', function() {
        const target = $(this).data('target');
        $('.pp-nav-btn').removeClass('active');
        $(this).addClass('active');
        $('.pp-complexity-pane').hide();
        $(`.pp-complexity-pane[data-level="${target}"]`).show();
    });

    $(document).on('click', '.pp-upload-trigger', function(e) {
        e.preventDefault();
        const btn = $(this);
        const parent = btn.closest('.pp-upload-card');
        const frame = wp.media({ title: 'Select High-Quality Asset', button: { text: 'Import to Service' }, multiple: false });
        frame.on('select', function() {
            const attachment = frame.state().get('selection').first().toJSON();
            parent.find('.pp-input-image').val(attachment.url);
            parent.find('.pp-upload-preview').html(`<img src="${attachment.url}">`);
            btn.text('Update Image');
        });
        frame.open();
    });

    renderTable();

    $('#pp-add-service-btn').on('click', function(e) {
        e.preventDefault();
        openModal(null);
    });

    $(document).on('click', '.pp-edit-trigger', function(e) {
        e.preventDefault();
        const id = $(this).closest('tr').data('id');
        const service = services.find(s => s.id == id);
        if (service) openModal(service);
    });

    $(document).on('click', '.pp-delete-trigger', function(e) {
        e.preventDefault();
        if(!confirm('DANGER: Delete this service?')) return;
        const id = $(this).closest('tr').attr('data-id'); 
        services = services.filter(s => String(s.id) !== String(id));
        $.post(ppData.ajaxUrl, {
            action: 'pp_save_services',
            nonce: ppData.nonce,
            services: JSON.stringify(services)
        }, function(res) {
            if (res.success) renderTable();
        });
    });

    $('.pp-modal-close, #pp-modal-cancel').on('click', function() {
        modal.fadeOut(250);
    });

    $('#pp-modal-save').on('click', saveService);
});
