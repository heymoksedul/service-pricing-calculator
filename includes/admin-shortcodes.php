<?php
function pp_render_shortcodes_page() {
    $services = get_option('pp_services_data', []);
    ?>
    <div class="wrap" style="background: #fff; padding: 20px; box-sizing: border-box; max-width: 1200px; margin-top: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 class="wp-heading-inline">Shortcodes</h1>
        <hr class="wp-header-end">
        
        <p>Use the following shortcodes to display the pricing calculator on your site.</p>

        <h2 style="margin-top: 30px;">Available Shortcodes</h2>
        
        <table class="widefat fixed striped" style="margin-top: 10px; border: 1px solid #e5e7eb;">
            <thead>
                <tr>
                    <th style="font-weight: 600;">Shortcode Type</th>
                    <th style="font-weight: 600;">Shortcode</th>
                    <th style="font-weight: 600;">Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Full Calculator</strong></td>
                    <td><code>[path_pricing_calculator service="SERVICE_NAME"]</code></td>
                    <td>Displays the full pricing calculator with complexity selection.</td>
                </tr>
                <tr>
                    <td><strong>Simple Calculator</strong></td>
                    <td><code>[path_pricing_simple service="SERVICE_NAME"]</code></td>
                    <td>Displays a simplified version of the calculator.</td>
                </tr>
            </tbody>
        </table>

        <h2 style="margin-top: 30px;">Ready-to-Use Shortcodes</h2>
        <p>Copy and paste the shortcodes below for your active services:</p>

        <?php if (empty($services)): ?>
            <div class="notice notice-warning inline"><p>No services found. Please add a service first.</p></div>
        <?php else: ?>
            <table class="widefat fixed striped" style="margin-top: 10px; border: 1px solid #e5e7eb;">
                <thead>
                    <tr>
                        <th style="width: 200px; font-weight: 600;">Service Name</th>
                        <th style="font-weight: 600;">Full Calculator Shortcode</th>
                        <th style="font-weight: 600;">Simple Calculator Shortcode</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($services as $service): 
                        $service_name = isset($service['title']) ? esc_attr($service['title']) : '';
                        if (empty($service_name)) continue;
                    ?>
                    <tr>
                        <td><strong><?php echo esc_html($service_name); ?></strong></td>
                        <td>
                            <code style="background: #f1f5f9; padding: 5px 8px; display: inline-block; border-radius: 4px;">
                                [path_pricing_calculator service="<?php echo $service_name; ?>"]
                            </code>
                        </td>
                        <td>
                            <code style="background: #f1f5f9; padding: 5px 8px; display: inline-block; border-radius: 4px;">
                                [path_pricing_simple service="<?php echo $service_name; ?>"]
                            </code>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    <?php
}
