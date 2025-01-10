const CONFIG = {
    API_PROTOCOL: 'http',
    API_HOST: "localhost",
    API_PORT: 8000,
    get API_BASE_URL() {
        return `${this.API_PROTOCOL}://${this.API_HOST}:${this.API_PORT}/api`;
    },
}
export default CONFIG