import EmojiResponse from "../domain/EmojiResponse.js";

export class Post {

    constructor(id, title, content, status, writtenBy, createdAt, bookmarked, commentCount, emojiResponse) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.status = this.translateStatusInKorean(status);
        this.createdAt = createdAt;
        this.bookmarked = bookmarked;
        this.writtenBy = writtenBy;
        this.commentCount = commentCount;
        this.emojiResponse = emojiResponse.map(
            dto => new EmojiResponse(dto.emoji, dto.totalCount, dto.usernames)
        );
    }

    translateStatusInKorean(status) {
        if (status === "IN_PROGRESS") {
            return "진행중"
        } else if (status === "UNCOMPLETED") {
            return "미완료"
        } else if (status === "COMPLETE") {
            return "완료"
        }
        return "상태미정";
    }
}
