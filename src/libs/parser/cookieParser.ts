export const cookieParser = (token: string) => {
    const cookie = token.split('; ').find((item: string) => item.startsWith('Cookie='));
    return cookie.split('=')[1]
}