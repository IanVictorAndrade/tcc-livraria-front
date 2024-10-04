export default function voltarParaPaginaComDelay(link: string) {
    setTimeout(() => {
        window.location.href = `${link}`;
    }, 2000);
}