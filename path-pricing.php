<?php
/**
 * Plugin Name: Path Pricing
 * Description: A service pricing calculator with a custom admin dashboard.
 * Version: 1.0.0
 * Author: Moksedul Islam
 * Author URI: https://moksedul.dev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Path_Pricing {
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_scripts' ] );
		add_shortcode( 'path_pricing_calculator', [ $this, 'render_shortcode' ] );
		add_shortcode( 'path_pricing_simple', [ $this, 'render_simple_shortcode' ] );
        add_action( 'wp_ajax_pp_save_services', [ $this, 'handle_save_services' ] );
        add_action( 'wp_ajax_pp_get_services', [ $this, 'handle_get_services' ] );
        add_action('wp_ajax_nopriv_pp_get_services', [$this, 'handle_get_services']);
        
        // Include Admin Page logic
        require_once plugin_dir_path(__FILE__) . 'includes/admin-page.php';
        require_once plugin_dir_path(__FILE__) . 'includes/admin-shortcodes.php';
	}

	public function register_admin_menu() {
		add_menu_page(
			'Path Pricing',
			'Path Pricing',
			'manage_options',
			'path-pricing',
			'pp_render_admin_page',
			'dashicons-calculator',
			50
		);

        add_submenu_page(
            'path-pricing',
            'Shortcodes',
            'Shortcodes',
            'manage_options',
            'path-pricing-shortcodes',
            'pp_render_shortcodes_page'
        );
	}

	public function enqueue_admin_scripts( $hook ) {
		if ( 'toplevel_page_path-pricing' !== $hook ) {
			return;
		}

        wp_enqueue_style('pp-admin-style', plugin_dir_url(__FILE__) . 'assets/css/admin.css', [], time() + 3);
        
        wp_enqueue_script(
			'pp-admin-script',
			plugin_dir_url( __FILE__ ) . 'assets/js/admin.js',
			['jquery'],
			time(),
			true
		);

        wp_localize_script('pp-admin-script', 'ppData', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('pp_admin_nonce'),
            'services' => get_option('pp_services_data', [])
        ]);
        
        wp_enqueue_media();
    }

    public function enqueue_frontend_scripts() {
        wp_register_script(
            'pp-frontend-script',
            plugin_dir_url( __FILE__ ) . 'assets/js/calculator.js',
            ['jquery'],
            time(),
            true
        );
        
        wp_localize_script('pp-frontend-script', 'ppData', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'services' => get_option('pp_services_data', [])
        ]);

        wp_register_style('pp-frontend-style', plugin_dir_url(__FILE__) . 'assets/css/calculator.css', [], time() + 10);
	}

	public function render_shortcode( $atts ) {
        $atts = shortcode_atts([
            'service' => ''
        ], $atts);

		wp_enqueue_script( 'pp-frontend-script' );
        wp_enqueue_style( 'pp-frontend-style' );
        
		return sprintf(
            '<div class="pp-calculator-wrapper" data-type="full" data-service="%s"><div class="pp-loading">Loading calculator...</div></div>',
            esc_attr($atts['service'])
        );
	}

    public function render_simple_shortcode( $atts ) {
        $atts = shortcode_atts([
            'service' => ''
        ], $atts);

        wp_enqueue_script( 'pp-frontend-script' );
        wp_enqueue_style( 'pp-frontend-style' );

        return sprintf(
            '<div class="pp-calculator-wrapper" data-type="simple" data-service="%s"><div class="pp-loading">Loading calculator...</div></div>',
            esc_attr($atts['service'])
        );
    }

	public function handle_save_services() {
		check_ajax_referer( 'pp_admin_nonce', 'nonce' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( 'Unauthorized' );
		}

		$services = isset( $_POST['services'] ) ? json_decode( stripslashes( $_POST['services'] ), true ) : [];
		update_option( 'pp_services_data', $services );
		wp_send_json_success( 'Saved' );
	}

	public function handle_get_services() {
		$services = get_option( 'pp_services_data', [] );
		wp_send_json_success( $services );
	}
}

new Path_Pricing();
