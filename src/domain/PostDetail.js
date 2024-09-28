import EmojiResponse from "../domain/EmojiResponse.js";
import {Comment} from "@/domain/Comment.js";
import {useUserStore} from "@/stores/User.js";

export class PostDetail {

    constructor(id, title, content, category, status, expiredDate, userId, username, createdAt, bookmarked, comments, emojiResponses, receiversName) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category
        this.status = status;
        this.expiredDate = expiredDate;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.bookmarked = bookmarked;
        this.comments = comments.map(
            dto => new Comment(dto.id, dto.userId, dto.username, dto.content, dto.writtenDate)
        );
        this.emojis = emojiResponses.map(
            dto => new EmojiResponse(dto.emoji, dto.totalCount, dto.usernames)
        );
        this.receiversName = receiversName;
    }

}
