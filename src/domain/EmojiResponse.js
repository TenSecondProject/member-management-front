export default class EmojiResponse {
    constructor(emoji, totalCount, usernames) {
        this.emoji = emoji;
        this.totalCount = totalCount;
        this.usernames = usernames;
    }
}