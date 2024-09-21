export const getDaysWithKorean = (date) => {
    const daysWithKorean = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}/${date.getDate()} (${daysWithKorean[date.getDay()]}) ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
}