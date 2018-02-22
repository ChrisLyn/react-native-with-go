package twitch

import (
	"fmt"
	"encoding/json"
	"net/http"
	"os"
	"log"
)

const streamURL string = "https://api.twitch.tv/kraken/streams/"

type AuthUrl struct {
	Domain string `json:"domain"`
	ClientID string `json:"client_id"`
	RedirectURI string `json:"redirect_uri"`
	ResponseType string `json:"response_type"`
	Scope string `json:"scope"`
}

type AuthRes struct {
	AccessToken string `json:"access_token"`
	RefreshToken string `json:"refresh_toekn"`
	Scope []string `json:"scope"`
	ExpireIn string `json:"expire_in"`
}

type StreamList struct {
	Total int `json:"_total"`
	Streams []StreamItem `json:"streams"`
}

type StreamItem struct {
	ID int `json:"_id"`
	AverageFps int `json:"average_fps"`
	Channel `json:"channel"`
	CreatedAt string `json:"created_at"`
	Deplay int `json:"delay"`
	Game string `json:"game"`
	IsPlaylist bool `json:"is_playlist"`
	Preview PreviewItem `json:"preview"`
	VideoHeight int `json:"video_height"`
	Viewers int `json:"viewers"`
}

type Channel struct {
	ID int `json:"_id"`
	BroadcasterLanguage string `json:"broadcaster_language"`
	CreatedAt string `json:"created_at"`
	DisplayName string `json:"display_name"`
	Followers int `json:"followers"`
	Game string `json:"game"`
	Language string `json:"language"`
	Logo string `json:"logo"`
	Mature bool `json:"mature"`
	Name string `json:"name"`
	Partner bool `json:"partner"`
	ProfileBanner string `json:"profile_banner"`
	ProfileBannerBackgroundColor string `json:"profile_banner_background_color"`
	Status string `json:"status"`
	UpdatedAt string `json:"updated_at"`
	URL string `json:"url"`
	VideoBanner string `json:"video_banner"`
	Views int `json:"views"`
}

type PreviewItem struct {
	Large string `json:"large"`
	Medium string `json:"medium"`
	Small string `json:"small"`
	Template string `json:"template"`
}

func init() {
	fmt.Println("Initializing Twitch API...")
}

func DoSomething() {
	fmt.Println("Something.")
}

func GetRedirectUri()(url string) {
	file, err := os.Open("./config/twitch_config.json")
	if err != nil {  log.Fatal(err) }  
	var auth AuthUrl
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&auth)
	if err != nil {  log.Fatal(err) }
	url = auth.Domain +
		"?client_id=" + auth.ClientID +
		"&redirect_uri=" + auth.RedirectURI +
		"&response_type=" + auth.ResponseType +
		"&scope=" + auth.Scope
	return
}

func StoreTokenAndFetchContent(authToken string)(videoURLs []string) {
	requestURL := streamURL + "followed"
	requestURL = "https://api.twitch.tv/kraken/streams"
	file, err := os.Open("./config/twitch_config.json")
	if err != nil {  log.Fatal(err) }  
	var auth AuthUrl
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&auth)
	if err != nil {  log.Fatal(err) }

	client := &http.Client{}
	req, _ := http.NewRequest("GET", requestURL, nil)
	req.Header.Set("Accept", "application/vnd.twitchtv.v5+json")
	req.Header.Set("Client-ID", auth.ClientID)
	res, _ := client.Do(req)
	streamDecoder := json.NewDecoder(res.Body)
	var streams StreamList
	_ = streamDecoder.Decode(&streams)
	videoURLs = make([]string, len(streams.Streams))
	for index, stream := range streams.Streams {
		videoURLs[index] = stream.Channel.URL
	}
	return
}
