// /* WiFi station Example

//    This example code is in the Public Domain (or CC0 licensed, at your option.)

//    Unless required by applicable law or agreed to in writing, this
//    software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
//    CONDITIONS OF ANY KIND, either express or implied.
// */
// //${timestamp()}
// //----------------------------------------------------------------Khai bao thu vien ----------------------------------------------------------------
// #include <stdio.h>
// #include <esp_websocket_client.h>

// #include <sys/param.h>
// #include "freertos/FreeRTOS.h"
// #include "freertos/task.h"
// #include "freertos/event_groups.h"
// #include "esp_system.h"
// #include "esp_wifi.h"
// #include "esp_event.h"
// #include "esp_log.h"
// #include "nvs_flash.h"
// #include "esp_netif.h"
// #include "esp_http_client.h"
// #include "esp_http_server.h"
// #include "esp_camera.h"
// #include "esp_timer.h"
// #include "cJSON.h"
// // biến wifi
// // #define WIFI_SSID "KTMT - SinhVien"
// // #define WIFI_PASS "sinhvien"
// #define WIFI_SSID "bambobobu"
// #define WIFI_PASS "22101993"
// // #define WIFI_SSID "Galaxy A32 5G"
// // #define WIFI_PASS "88888888"
// #define BOARD_ESP32CAM_AITHINKER
// //----------------------------------------------------------------Khoi tao camera --------------------------------
// #define CAM_PIN_PWDN 32
// #define CAM_PIN_RESET -1 // software reset will be performed
// #define CAM_PIN_XCLK 0
// #define CAM_PIN_SIOD 26
// #define CAM_PIN_SIOC 27

// #define CAM_PIN_D7 35
// #define CAM_PIN_D6 34
// #define CAM_PIN_D5 39
// #define CAM_PIN_D4 36
// #define CAM_PIN_D3 21
// #define CAM_PIN_D2 19
// #define CAM_PIN_D1 18
// #define CAM_PIN_D0 5
// #define CAM_PIN_VSYNC 25
// #define CAM_PIN_HREF 23
// #define CAM_PIN_PCLK 22

// static const char *TAG = "example:take_picture";

// camera_config_t camera_config = {
//     .pin_pwdn = CAM_PIN_PWDN,
//     .pin_reset = CAM_PIN_RESET,
//     .pin_xclk = CAM_PIN_XCLK,
//     .pin_sscb_sda = CAM_PIN_SIOD,
//     .pin_sscb_scl = CAM_PIN_SIOC,

//     .pin_d7 = CAM_PIN_D7,
//     .pin_d6 = CAM_PIN_D6,
//     .pin_d5 = CAM_PIN_D5,
//     .pin_d4 = CAM_PIN_D4,
//     .pin_d3 = CAM_PIN_D3,
//     .pin_d2 = CAM_PIN_D2,
//     .pin_d1 = CAM_PIN_D1,
//     .pin_d0 = CAM_PIN_D0,
//     .pin_vsync = CAM_PIN_VSYNC,
//     .pin_href = CAM_PIN_HREF,
//     .pin_pclk = CAM_PIN_PCLK,
//     // them dong nay de khong loi
//     .fb_location = CAMERA_FB_IN_DRAM,
//     // XCLK 20MHz or 10MHz for OV2640 double FPS (Experimental)
//     .xclk_freq_hz = 20000000,
//     .ledc_timer = LEDC_TIMER_0,
//     .ledc_channel = LEDC_CHANNEL_0,

//     .pixel_format = PIXFORMAT_JPEG, // YUV422,GRAYSCALE,RGB565,JPEG
//     .frame_size = FRAMESIZE_QVGA,   // QQVGA-UXGA Do not use sizes above QVGA when not JPEG

//     .jpeg_quality = 12, // 0-63 lower number means higher quality
//     .fb_count = 1       // if more than one, i2s runs in continuous mode. Use only with JPEG
// };
// static esp_err_t init_camera(void)
// {
//     // initialize the camera
//     esp_err_t err = esp_camera_init(&camera_config);
//     if (err != ESP_OK)
//     {
//         ESP_LOGE(TAG, "Camera Init Failed");
//         return err;
//     }

//     return ESP_OK;
// }

// //----------------------------------------------------------------chup anh------------------------
// camera_fb_t *capture_image_from_camera()
// {
//     ESP_LOGI(TAG, "Taking picture...");
//     camera_fb_t *pic = esp_camera_fb_get();
//     ESP_LOGI(TAG, "Picture taken! Its size was: %zu bytes", pic->len);
//     esp_camera_fb_return(pic);
//     return pic;
// }
// //----------------------------------------------------------------xu ly su kien wifi------------------------

// static void wifi_event_handler(void *event_handler_arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
// {

//     switch (event_id)
//     {
//     case WIFI_EVENT_STA_START:
//         printf("WiFi connecting ... \n");
//         break;
//     case WIFI_EVENT_STA_CONNECTED:
//         printf("WiFi connected ... \n");
//         break;
//     case WIFI_EVENT_STA_DISCONNECTED:
//         printf("WiFi lost connection ... \n");
//         break;
//     case IP_EVENT_STA_GOT_IP:
//         printf("WiFi got IP ... \n\n");
//         break;
//     default:
//         break;
//     }
// }
// //----------------------------------------------------------------Ket noi wifi --------------------------------
// void connect_wifi()
// {
//     nvs_flash_init();
//     // 1 - Wi-Fi/LwIP Init Phase
//     esp_netif_init();                    // TCP/IP initiation 					s1.1
//     esp_event_loop_create_default();     // event loop 			                s1.2
//     esp_netif_create_default_wifi_sta(); // WiFi station 	                    s1.3
//     wifi_init_config_t wifi_initiation = WIFI_INIT_CONFIG_DEFAULT();
//     esp_wifi_init(&wifi_initiation); // 					                    s1.4
//     // 2 - Wi-Fi Configuration Phase
//     esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_handler, NULL);
//     esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_handler, NULL);
//     wifi_config_t wifi_configuration = {
//         .sta = {
//             .ssid = WIFI_SSID,
//             .password = WIFI_PASS}};
//     esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_configuration);
//     // 3 - Wi-Fi Start Phase
//     esp_wifi_start();
//     // 4- Wi-Fi Connect Phase
//     esp_wifi_connect();
// }

// static void lost_connection(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
// {
//     if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED)
//     {
//         connect_wifi();
//         printf("reconnection");
//     }
// }
// //----ws--------------------------------
// static void websocket_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
// {
//     esp_websocket_event_data_t *data = (esp_websocket_event_data_t *)event_data;
//     switch (event_id)
//     {
//     case WEBSOCKET_EVENT_CONNECTED:
//         ESP_LOGI(TAG, "WEBSOCKET_EVENT_CONNECTED");
//         break;
//     case WEBSOCKET_EVENT_DATA:
//         ESP_LOGW(TAG, "Received=%.*s\n", data->data_len, (char *)data->data_ptr);
//         break;
//     }
// }

// static void websocket_app_start(void)
// {

//     esp_websocket_client_config_t websocket_cfg = {};
//     websocket_cfg.uri = "ws://192.168.1.227:8080/image";
//     //  ws for url
//     // websocket_cfg.uri = "ws://192.168.1.6:8080/image";
//     // ws for aws
//     // websocket_cfg.uri = "ws://54.252.188.221:8080/image";
//     ESP_LOGI(TAG, "Connecting to %s ...", websocket_cfg.uri);

//     // Connect to Websocket Server
//     esp_websocket_client_handle_t client = esp_websocket_client_init(&websocket_cfg);
//     esp_websocket_register_events(client, WEBSOCKET_EVENT_ANY, websocket_event_handler, (void *)client);

//     esp_websocket_client_start(client);
//     while (1)
//     {
//         // if (esp_websocket_client_is_connected(client))
//         // {
//         camera_fb_t *pic = esp_camera_fb_get();
//         esp_websocket_client_send(client, (const char *)pic->buf, pic->len, portMAX_DELAY);
//         esp_camera_fb_return(pic);
//         // }
//     }
//     esp_websocket_client_stop(client);
//     ESP_LOGI(TAG, "Websocket Stopped");
//     esp_websocket_client_destroy(client);
// }
// void app_main(void)
// {

//     esp_err_t ret = nvs_flash_init();
//     // kt lỗi để tự động kết nối lại wifi
//     if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
//     {
//         ESP_ERROR_CHECK(nvs_flash_erase());
//         ret = nvs_flash_init();
//     }
//     ESP_ERROR_CHECK(ret);

//     ESP_ERROR_CHECK(esp_netif_init());

//     ESP_ERROR_CHECK(esp_event_loop_create_default());

//     ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &lost_connection, NULL));

//     init_camera();
//     connect_wifi();

//     vTaskDelay(5000 / portTICK_PERIOD_MS);
//     // camera_fb_t *pic = capture_image_from_camera();

//     // send_data_to_webserver();
//     websocket_app_start();
// }
/* WiFi station Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/
//${timestamp()}
//----------------------------------------------------------------Khai bao thu vien ----------------------------------------------------------------
#include <stdio.h>
#include <esp_websocket_client.h>

#include <sys/param.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_netif.h"
#include "esp_http_client.h"
#include "esp_http_server.h"
#include "esp_camera.h"
#include "esp_timer.h"
#include "cJSON.h"
// biến wifi

// #define WIFI_SSID "B15.01_2.4G"
// #define WIFI_PASS "16910301"
// #define WIFI_SSID "Galaxy A32 5G"
// #define WIFI_PASS "88888888"
#define WIFI_SSID "bambobobu"
#define WIFI_PASS "22101993"
#define BOARD_ESP32CAM_AITHINKER
//----------------------------------------------------------------Khoi tao camera --------------------------------
#define CAM_PIN_PWDN 32
#define CAM_PIN_RESET -1 // software reset will be performed
#define CAM_PIN_XCLK 0
#define CAM_PIN_SIOD 26
#define CAM_PIN_SIOC 27

#define CAM_PIN_D7 35
#define CAM_PIN_D6 34
#define CAM_PIN_D5 39
#define CAM_PIN_D4 36
#define CAM_PIN_D3 21
#define CAM_PIN_D2 19
#define CAM_PIN_D1 18
#define CAM_PIN_D0 5
#define CAM_PIN_VSYNC 25
#define CAM_PIN_HREF 23
#define CAM_PIN_PCLK 22

static const char *TAG = "example:take_picture";

camera_config_t camera_config = {
    .pin_pwdn = CAM_PIN_PWDN,
    .pin_reset = CAM_PIN_RESET,
    .pin_xclk = CAM_PIN_XCLK,
    .pin_sscb_sda = CAM_PIN_SIOD,
    .pin_sscb_scl = CAM_PIN_SIOC,

    .pin_d7 = CAM_PIN_D7,
    .pin_d6 = CAM_PIN_D6,
    .pin_d5 = CAM_PIN_D5,
    .pin_d4 = CAM_PIN_D4,
    .pin_d3 = CAM_PIN_D3,
    .pin_d2 = CAM_PIN_D2,
    .pin_d1 = CAM_PIN_D1,
    .pin_d0 = CAM_PIN_D0,
    .pin_vsync = CAM_PIN_VSYNC,
    .pin_href = CAM_PIN_HREF,
    .pin_pclk = CAM_PIN_PCLK,
    // them dong nay de khong loi
    .fb_location = CAMERA_FB_IN_DRAM,
    // XCLK 20MHz or 10MHz for OV2640 double FPS (Experimental)
    .xclk_freq_hz = 20000000,
    .ledc_timer = LEDC_TIMER_0,
    .ledc_channel = LEDC_CHANNEL_0,

    .pixel_format = PIXFORMAT_JPEG, // YUV422,GRAYSCALE,RGB565,JPEG
    .frame_size = FRAMESIZE_QVGA,   // QQVGA-UXGA Do not use sizes above QVGA when not JPEG

    .jpeg_quality = 12, // 0-63 lower number means higher quality
    .fb_count = 1       // if more than one, i2s runs in continuous mode. Use only with JPEG
};
static esp_err_t init_camera(void)
{
    // initialize the camera
    esp_err_t err = esp_camera_init(&camera_config);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "Camera Init Failed");
        return err;
    }

    return ESP_OK;
}

//----------------------------------------------------------------chup anh------------------------
camera_fb_t *capture_image_from_camera()
{
    ESP_LOGI(TAG, "Taking picture...");
    camera_fb_t *pic = esp_camera_fb_get();
    ESP_LOGI(TAG, "Picture taken! Its size was: %zu bytes", pic->len);
    esp_camera_fb_return(pic);
    return pic;
}
//----------------------------------------------------------------xu ly su kien wifi------------------------

static void wifi_event_handler(void *event_handler_arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{

    switch (event_id)
    {
    case WIFI_EVENT_STA_START:
        printf("WiFi connecting ... \n");
        break;
    case WIFI_EVENT_STA_CONNECTED:
        printf("WiFi connected ... \n");
        break;
    case WIFI_EVENT_STA_DISCONNECTED:
        printf("WiFi lost connection ... \n");
        break;
    case IP_EVENT_STA_GOT_IP:
        printf("WiFi got IP ... \n\n");
        break;
    default:
        break;
    }
}
//----------------------------------------------------------------Ket noi wifi --------------------------------
void connect_wifi()
{
    nvs_flash_init();
    // 1 - Wi-Fi/LwIP Init Phase
    esp_netif_init();                    // TCP/IP initiation 					s1.1
    esp_event_loop_create_default();     // event loop 			                s1.2
    esp_netif_create_default_wifi_sta(); // WiFi station 	                    s1.3
    wifi_init_config_t wifi_initiation = WIFI_INIT_CONFIG_DEFAULT();
    esp_wifi_init(&wifi_initiation); // 					                    s1.4
    // 2 - Wi-Fi Configuration Phase
    esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_handler, NULL);
    esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_handler, NULL);
    wifi_config_t wifi_configuration = {
        .sta = {
            .ssid = WIFI_SSID,
            .password = WIFI_PASS}};
    esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_configuration);
    // 3 - Wi-Fi Start Phase
    esp_wifi_start();
    // 4- Wi-Fi Connect Phase
    esp_wifi_connect();
}

static void lost_connection(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED)
    {
        connect_wifi();
        printf("reconnection");
    }
}
//----ws--------------------------------
static void websocket_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    esp_websocket_event_data_t *data = (esp_websocket_event_data_t *)event_data;
    switch (event_id)
    {
    case WEBSOCKET_EVENT_CONNECTED:
        ESP_LOGI(TAG, "WEBSOCKET_EVENT_CONNECTED");
        break;
    case WEBSOCKET_EVENT_DATA:
        ESP_LOGW(TAG, "Received=%.*s\n", data->data_len, (char *)data->data_ptr);
        break;
    }
}

static void websocket_app_start(void)
{

    esp_websocket_client_config_t websocket_cfg = {};
    websocket_cfg.uri = "ws://192.168.1.227:8080/image";
    //  ws for url
    // websocket_cfg.uri = "ws://192.168.1.6:8080/image";
    // ws for aws
    // websocket_cfg.uri = "ws://54.252.188.221:8080/image";
    ESP_LOGI(TAG, "Connecting to %s ...", websocket_cfg.uri);

    // Connect to Websocket Server
    esp_websocket_client_handle_t client = esp_websocket_client_init(&websocket_cfg);
    esp_websocket_register_events(client, WEBSOCKET_EVENT_ANY, websocket_event_handler, (void *)client);

    esp_websocket_client_start(client);
    while (1)
    {
        // if (esp_websocket_client_is_connected(client))
        // {
        camera_fb_t *pic = esp_camera_fb_get();
        esp_websocket_client_send(client, (const char *)pic->buf, pic->len, portMAX_DELAY);
        esp_camera_fb_return(pic);
        // }
    }
    esp_websocket_client_stop(client);
    ESP_LOGI(TAG, "Websocket Stopped");
    esp_websocket_client_destroy(client);
}
void app_main(void)
{

    esp_err_t ret = nvs_flash_init();
    // kt lỗi để tự động kết nối lại wifi
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    ESP_ERROR_CHECK(esp_netif_init());

    ESP_ERROR_CHECK(esp_event_loop_create_default());

    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &lost_connection, NULL));

    init_camera();
    connect_wifi();

    vTaskDelay(5000 / portTICK_PERIOD_MS);
    // camera_fb_t *pic = capture_image_from_camera();

    // send_data_to_webserver();
    websocket_app_start();
}
