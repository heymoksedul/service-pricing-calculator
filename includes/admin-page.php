<?php
function pp_render_admin_page() {
    ?>
    <div class="wrap pp-admin-wrap">
        <div class="pp-top-bar">
            <h1 class="wp-heading-inline">Path Pricing</h1>
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="text" id="pp-service-search" placeholder="Search services..." class="pp-search-input">
                <button id="pp-add-service-btn" class="pp-btn pp-btn-primary">+ Add Service</button>
            </div>
        </div>

        <div class="pp-table-card">
            <table class="wp-list-table widefat fixed striped table-view-list posts pp-table">
                <thead>
                    <tr>
                        <th scope="col" style="width: 40px;">#</th>
                        <th scope="col" style="width: 60px;">Preview</th>
                        <th scope="col">Service Name</th>
                        <th scope="col">Pricing Variants</th>
                        <th scope="col" style="width: 80px;">Action</th>
                    </tr>
                </thead>
                <tbody id="pp-services-table-body">
                    <!-- Rows injected via JS -->
                </tbody>
            </table>
            
            <div class="no-services-msg" style="display:none; text-align:center; padding: 30px;">
                <p style="color: #64748b;">No services found.</p>
            </div>
        </div>

        <!-- Editor Modal -->
        <div id="pp-modal-overlay" class="pp-modal-overlay" style="display:none;">
            <div class="pp-modal">
                <div class="pp-modal-header">
                    <h2 id="pp-modal-title">Edit Service</h2>
                    <button type="button" class="pp-modal-close">×</button>
                </div>
                <div class="pp-modal-body">
                    <input type="hidden" id="pp-edit-id">
                    
                    <div class="pp-form-section">
                        <div class="pp-section-title">General Information</div>
                        <div class="pp-form-row">
                            <label class="pp-label">Service Title</label>
                            <input type="text" id="pp-edit-title" class="pp-input" placeholder="e.g. Clipping Path">
                        </div>
                        <div class="pp-form-row">
                            <label class="pp-label">Description</label>
                            <textarea id="pp-edit-desc" class="pp-textarea" rows="2" placeholder="Brief service overview..."></textarea>
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
                    <button type="button" class="pp-btn pp-btn-secondary" id="pp-modal-cancel">Cancel</button>
                    <button type="button" class="pp-btn pp-btn-primary" id="pp-modal-save">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
    <?php
}
