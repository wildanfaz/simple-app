export function isAlphaSpace(str) {
    const regexp = /^[a-zA-Z\s]+$/
    return regexp.test(str)
}