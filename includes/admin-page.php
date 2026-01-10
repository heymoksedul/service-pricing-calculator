<?php
function pp_render_admin_page() {
    ?>
    <div class="wrap pp-admin-wrap">
        <!-- Top bar with Search and Add New -->
        <div class="pp-top-bar">
            <div class="pp-search-box">
                <input type="text" id="pp-service-search" placeholder="Search service..." class="pp-search-input">
            </div>
            <button id="pp-add-service-btn" class="pp-btn pp-btn-primary">+ Add New</button>
        </div>

        <!-- Service List Table -->
        <div class="pp-table-card">
            <table class="wp-list-table widefat fixed striped table-view-list posts pp-table">
                <thead>
                    <tr>
                        <th scope="col" class="manage-column" style="width: 50px;">#</th>
                        <th scope="col" class="manage-column" style="width: 80px;">Preview</th>
                        <th scope="col" class="manage-column">Service</th>
                        <th scope="col" class="manage-column">Pricing</th>
                        <th scope="col" class="manage-column" style="width: 100px;">Action</th>
                    </tr>
                </thead>
                <tbody id="pp-services-table-body">
                    <!-- Rows injected via JS -->
                </tbody>
            </table>
            
            <div class="no-services-msg" style="display:none; text-align:center; padding: 40px; background: white; border-radius: 8px;">
                <span class="dashicons dashicons-info" style="font-size: 40px; width: 40px; height: 40px; color: #cbd5e1; margin-bottom: 10px;"></span>
                <p style="font-size: 16px; color: #64748b;">No services found.</p>
            </div>
        </div>

        <!-- Editor Modal -->
        <div id="pp-modal-overlay" class="pp-modal-overlay" style="display:none;">
            <div class="pp-modal">
                <div class="pp-modal-header">
                    <h2 id="pp-modal-title">Edit Service</h2>
                    <button type="button" class="pp-modal-close dashicons dashicons-no-alt"></button>
                </div>
                <div class="pp-modal-body">
                    <input type="hidden" id="pp-edit-id">
                    
                    <div class="pp-form-card">
                        <div class="pp-card-title">
                            <span class="dashicons dashicons-admin-settings"></span>
                            General Information
                        </div>
                        <div class="pp-form-row">
                            <label class="pp-label">Service Title</label>
                            <input type="text" id="pp-edit-title" class="pp-input" placeholder="e.g. Clipping Path">
                        </div>
                        <div class="pp-form-row">
                            <label class="pp-label">Short Description</label>
                            <textarea id="pp-edit-desc" class="pp-textarea" rows="2" placeholder="Tell users what this service covers..."></textarea>
                        </div>
                    </div>

                    <div class="pp-tab-wrapper">
                        <div class="pp-nav-tabs" id="pp-complexity-nav">
                            <!-- Dynamic Tabs -->
                        </div>
                        <button type="button" class="pp-add-variant-btn-alt" id="pp-add-variant-btn">+ Add Variant</button>
                    </div>

                    <div id="pp-complexity-container">
                        <!-- Dynamic Panes -->
                    </div>
                </div>
                <div class="pp-modal-footer">
                    <button type="button" class="pp-btn pp-btn-secondary" id="pp-modal-cancel">Discard</button>
                    <button type="button" class="pp-btn pp-btn-primary" id="pp-modal-save">Save Service</button>
                </div>
            </div>
        </div>
    </div>
    <?php
}
