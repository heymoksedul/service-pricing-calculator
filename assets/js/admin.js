jQuery(document).ready(function($) {
    const tableBody = $('#pp-services-table-body');
    const modal = $('#pp-modal-overlay');
    
    // State
    let services = ppData.services || [];
    let currentVariants = []; // Each: { id, name, price, qa_question, qa_answer, image }
    const defaultVariants = [
        {id: 'simple', name: 'Simple'}
    ];

    // --- RENDER TABLE ---
    function renderTable() {
        tableBody.empty();
        if (services.length === 0) {
            $('.no-services-msg').show();
            return;
        }
        $('.no-services-msg').hide();

        services.forEach(service => {
            const svcVariants = service.variants || defaultVariants;
            const firstVariantId = svcVariants.length > 0 ? svcVariants[0].id : '';
            const imgUrl = (service.complexities?.[firstVariantId]?.image) || '';
            const thumbHtml = imgUrl ? `<img src="${imgUrl}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">` : '<div style="width:60px; height:60px; background:#f0f0f1; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#ccc;"><span class="dashicons dashicons-format-image"></span></div>';

            let priceBadges = '';
            svcVariants.slice(0, 3).forEach(v => {
                const priceData = (service.complexities?.[v.id]) || {};
                const price = priceData.price || '-';
                priceBadges += `<span class="pp-price-badge" style="background:#e5e7eb; padding:2px 6px; border-radius:4px; font-size:11px; margin-right:4px;">${v.name[0]}: $${price}</span>`;
            });

            const row = `
                <tr data-id="${service.id}">
                    <td class="column-thumb">
                        ${thumbHtml}
                    </td>
                    <td class="column-title column-primary">
                        <strong><a href="#" class="row-title pp-edit-trigger" style="font-size:14px; color:#2271b1;">${service.title || '(No Title)'}</a></strong>
                        <div class="row-actions" style="margin-top:8px;">
                            <span class="edit"><a href="#" class="pp-edit-trigger">Edit</a> | </span>
                            <span class="trash"><a href="#" class="pp-delete-trigger" style="color:#b32d2e;">Delete</a></span>
                        </div>
                    </td>
                    <td>${service.short_description || '<span style="color:#999;">—</span>'}</td>
                    <td>
                        <div style="display:flex; flex-wrap:wrap; gap:4px;">
                            ${priceBadges}
                            ${svcVariants.length > 3 ? '<span style="color:#999; font-size:11px;">...</span>' : ''}
                        </div>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

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
            
            const imgHtml = v.image ? `<img src="${v.image}" style="max-height:80px; display:block; margin: 10px 0;">` : '';

            container.append(`
                <div class="pp-complexity-pane" data-level="${v.id}" style="${display}">
                    <div style="background:#f9f9f9; padding:10px; border-radius:4px; margin-bottom:15px; border:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                        <div style="display:flex; gap:10px; align-items:center; flex:1;">
                            <label style="font-weight:600; margin:0;">Variant Name:</label>
                            <input type="text" class="pp-variant-name-input" value="${v.name}" data-id="${v.id}" style="width:200px;">
                        </div>
                        <button type="button" class="button pp-delete-variant-btn" data-id="${v.id}" style="color:#b32d2e !important; border-color:#b32d2e !important; background: #fff !important;">Delete Variant</button>
                    </div>

                    <div class="pp-cols">
                        <div class="pp-col">
                            <label>Price ($)</label>
                            <input type="number" step="0.01" class="widefat pp-input-price" value="${v.price || ''}">
                        </div>
                        <div class="pp-col">
                            <label>Image</label>
                            <div class="pp-upload-box">
                                <input type="hidden" class="pp-input-image" value="${v.image || ''}">
                                <div class="img-preview">${v.image ? `<img src="${v.image}" style="max-height:80px; display:block; margin: 10px 0;">` : ''}</div>
                                <button type="button" class="button pp-upload-trigger">Select Image</button>
                            </div>
                        </div>
                    </div>
                    <div class="pp-form-row">
                        <label>Q&A Question</label>
                        <input type="text" class="widefat pp-input-question" value="${v.qa_question || 'How do we define ' + v.name + '?'}">
                    </div>
                    <div class="pp-form-row">
                        <label>Q&A Answer</label>
                        <textarea class="widefat pp-input-answer" rows="3">${v.qa_answer || ''}</textarea>
                    </div>
                </div>
            `);
        });
    }

    function syncCurrentData() {
        currentVariants.forEach(v => {
            const pane = $(`.pp-complexity-pane[data-level="${v.id}"]`);
            if (pane.length) {
                v.price = pane.find('.pp-input-price').val();
                v.qa_question = pane.find('.pp-input-question').val();
                v.qa_answer = pane.find('.pp-input-answer').val();
                v.image = pane.find('.pp-input-image').val();
            }
        });
    }

    function openModal(service = null) {
        // Prepare local variants with full data
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
        $('#pp-modal-title').text(service ? 'Edit Service' : 'Add New Service');

        modal.fadeIn(200);
    }

    function saveService() {
        syncCurrentData(); // Capture latest before saving

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
        btn.prop('disabled', true).text('Saving...');
        
        $.post(ppData.ajaxUrl, {
            action: 'pp_save_services',
            nonce: ppData.nonce,
            services: JSON.stringify(services)
        }, function(res) {
            btn.prop('disabled', false).text('Save Service');
            if(res.success) {
                renderTable();
                modal.fadeOut(200);
            } else {
                alert('Error saving data.');
            }
        });
    }

    // --- VARIANT MANAGEMENT WITHIN MODAL ---
    $(document).on('click', '#pp-add-variant-btn', function(e) {
        e.preventDefault();
        console.log('Add variant clicked');
        syncCurrentData();
        const newId = 'var_' + Date.now();
        currentVariants.push({ id: newId, name: 'New Variant', price: '', qa_question: '', qa_answer: '', image: '' });
        
        buildModalStructure();
        
        $('.pp-nav-btn').removeClass('active').last().addClass('active');
        $('.pp-complexity-pane').hide().last().show();
    });

    $(document).on('click', '.pp-delete-variant-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = $(this);
        const id = String(btn.attr('data-id'));
        
        if (currentVariants.length <= 1) {
            alert('A service must have at least one pricing variant.');
            return;
        }
        
        if (!btn.hasClass('pp-confirming')) {
            // Step 1: Confirm state
            btn.addClass('pp-confirming').text('Confirm Delete?').css({
                'background': '#b32d2e',
                'color': '#fff',
                'border-color': '#8a2324'
            });
            
            // Revert after 3s if not clicked again
            setTimeout(() => {
                btn.removeClass('pp-confirming').text('Delete Variant').css({
                    'background': '#fff',
                    'color': '#b32d2e',
                    'border-color': '#b32d2e'
                });
            }, 3000);
            return;
        }

        // Step 2: Logic
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

    // --- EVENTS ---
    renderTable();

    $('#pp-add-service-btn').on('click', function(e) {
        e.preventDefault();
        openModal(null);
    });

    tableBody.on('click', '.pp-edit-trigger', function(e) {
        e.preventDefault();
        const id = $(this).closest('tr').data('id');
        const service = services.find(s => s.id == id);
        if (service) openModal(service);
    });

    $(document).on('click', '.pp-delete-trigger', function(e) {
        e.preventDefault();
        if(!confirm('Are you sure you want to delete this service?')) return;
        
        const $row = $(this).closest('tr');
        const id = $row.attr('data-id'); 
        
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
        modal.fadeOut(200);
    });

    $('#pp-modal-save').on('click', saveService);

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
        const parent = btn.closest('.pp-upload-box');
        const frame = wp.media({ title: 'Select Image', button: { text: 'Use this image' }, multiple: false });
        frame.on('select', function() {
            const attachment = frame.state().get('selection').first().toJSON();
            parent.find('.pp-input-image').val(attachment.url);
            parent.find('.img-preview').html(`<img src="${attachment.url}" style="max-height:80px; margin:10px 0;">`);
        });
        frame.open();
    });
});
