<?php
function pp_render_admin_page() {
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">Path Pricing Services</h1>
        <button id="pp-add-service-btn" class="page-title-action">Add New Service</button>
        <hr class="wp-header-end">

        <!-- Service List Table -->
        <table class="wp-list-table widefat fixed striped table-view-list posts">
            <thead>
                <tr>
                    <th scope="col" class="manage-column column-thumb" style="width: 80px;">Image</th>
                    <th scope="col" class="manage-column column-title column-primary">Service Name</th>
                    <th scope="col" class="manage-column">Description</th>
                    <th scope="col" class="manage-column">Prices</th>
                </tr>
            </thead>
            <tbody id="pp-services-table-body">
                <!-- Rows injected via JS -->
            </tbody>
        </table>
        
        <p class="no-services-msg" style="display:none; text-align:center; margin-top: 20px;">No services found.</p>

        <!-- Editor Modal -->
        <div id="pp-modal-overlay" class="pp-modal-overlay" style="display:none;">
            <div class="pp-modal">
                <div class="pp-modal-header">
                    <h2 id="pp-modal-title">Edit Service</h2>
                    <button type="button" class="pp-modal-close dashicons dashicons-no-alt"></button>
                </div>
                <div class="pp-modal-body">
                    <input type="hidden" id="pp-edit-id">
                    
                    <div class="pp-form-section">
                        <div class="pp-form-row">
                            <label>Service Title</label>
                            <input type="text" id="pp-edit-title" class="widefat" placeholder="Enter service name...">
                        </div>
                        <div class="pp-form-row">
                            <label>Short Description</label>
                            <textarea id="pp-edit-desc" class="widefat" rows="2"></textarea>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #ddd; margin-bottom: 20px;">
                        <div class="pp-complexity-nav" id="pp-complexity-nav" style="border-bottom:none; margin-bottom:0;">
                            <!-- Dynamic Tabs -->
                        </div>
                        <button type="button" class="button" id="pp-add-variant-btn" style="margin-bottom: -1px; height: 32px;">+ Add Variant</button>
                    </div>

                    <div id="pp-complexity-container">
                        <!-- Dynamic Panes -->
                    </div>
                </div>
                <div class="pp-modal-footer">
                    <button type="button" class="button button-large" id="pp-modal-cancel">Cancel</button>
                    <button type="button" class="button button-primary button-large" id="pp-modal-save">Save Service</button>
                </div>
            </div>
        </div>
    </div>
    <?php
}
