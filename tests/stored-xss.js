// Stored XSS 漏洞示例文件

// 示例 1: 存储用户评论中的恶意脚本
export function storedXssExample1(commentText, userName) {
  // 危险：未净化的评论文本存储到数据库
  const comment = {
    user: userName,
    text: commentText,  // 恶意脚本可能被存储
    timestamp: new Date()
  };
  // 存储到数据库
  saveCommentToDatabase(comment);
  return comment;
}

// 示例 2: 存储用户个人资料中的恶意内容
export function storedXssExample2(profileData) {
  // 危险：用户个人资料信息未经净化就存储
  const profile = {
    bio: profileData.bio,
    website: profileData.website,
    displayName: profileData.displayName
  };
  // 存储到数据库，可能包含恶意脚本
  saveProfileToDatabase(profile);
  return profile;
}

// 示例 3: 存储博客文章中的恶意内容
export function storedXssExample3(blogPost) {
  // 危险：博客文章内容未经净化就存储
  const post = {
    title: blogPost.title,
    content: blogPost.content,  // 可能包含恶意脚本
    author: blogPost.author,
    createdAt: new Date()
  };
  // 存储到数据库
  saveBlogPostToDatabase(post);
  return post;
}

// 示例 4: 存储论坛帖子中的恶意脚本
export function storedXssExample4(forumPost) {
  // 危险：论坛帖子内容直接存储
  const post = {
    threadId: forumPost.threadId,
    content: forumPost.content,  // 恶意脚本可能被存储
    authorId: forumPost.authorId,
    postedAt: new Date()
  };
  // 存储到数据库
  saveForumPostToDatabase(post);
  return post;
}

// 示例 5: 存储用户消息中的恶意内容
export function storedXssExample5(message) {
  // 危险：消息内容未经净化就存储
  const msg = {
    sender: message.sender,
    recipient: message.recipient,
    content: message.content,  // 可能包含恶意脚本
    sentAt: new Date()
  };
  // 存储到数据库
  saveMessageToDatabase(msg);
  return msg;
}

// 示例 6: 存储产品评价中的恶意脚本
export function storedXssExample6(review) {
  // 危险：产品评价内容直接存储
  const productReview = {
    productId: review.productId,
    reviewer: review.reviewer,
    rating: review.rating,
    comment: review.comment  // 恶意脚本可能被存储
  };
  // 存储到数据库
  saveReviewToDatabase(productReview);
  return productReview;
}

// 示例 7: 存储维基页面中的恶意内容
export function storedXssExample7(wikiPage) {
  // 危险：维基页面内容未经净化就存储
  const page = {
    title: wikiPage.title,
    content: wikiPage.content,  // 可能包含恶意脚本
    lastModifiedBy: wikiPage.lastModifiedBy,
    updatedAt: new Date()
  };
  // 存储到数据库
  saveWikiPageToDatabase(page);
  return page;
}

// 示例 8: 存储用户笔记中的恶意脚本
export function storedXssExample8(note) {
  // 危险：用户笔记内容直接存储
  const userNote = {
    userId: note.userId,
    title: note.title,
    content: note.content,  // 恶意脚本可能被存储
    tags: note.tags
  };
  // 存储到数据库
  saveNoteToDatabase(userNote);
  return userNote;
}

// 示例 9: 存储任务描述中的恶意内容
export function storedXssExample9(task) {
  // 危险：任务描述未经净化就存储
  const projectTask = {
    projectId: task.projectId,
    title: task.title,
    description: task.description,  // 可能包含恶意脚本
    assignedTo: task.assignedTo
  };
  // 存储到数据库
  saveTaskToDatabase(projectTask);
  return projectTask;
}

// 示例 10: 存储聊天消息历史中的恶意脚本
export function storedXssExample10(chatMessage) {
  // 危险：聊天消息内容直接存储
  const message = {
    roomId: chatMessage.roomId,
    sender: chatMessage.sender,
    message: chatMessage.message,  // 恶意脚本可能被存储
    timestamp: new Date()
  };
  // 存储到数据库
  saveChatMessageToDatabase(message);
  return message;
}

// 示例 11: 存储用户配置中的恶意脚本
export function storedXssExample11(config) {
  // 危险：用户配置可能包含恶意脚本
  const userConfig = {
    userId: config.userId,
    preferences: config.preferences,  // 可能包含恶意脚本
    theme: config.theme
  };
  // 存储到数据库
  saveConfigToDatabase(userConfig);
  return userConfig;
}

// 示例 12: 存储活动日志中的恶意内容
export function storedXssExample12(logEntry) {
  // 危险：日志条目可能包含恶意脚本
  const log = {
    userId: logEntry.userId,
    action: logEntry.action,
    details: logEntry.details,  // 可能包含恶意脚本
    timestamp: new Date()
  };
  // 存储到数据库
  saveLogEntryToDatabase(log);
  return log;
}

// 示例 13: 存储用户上传的文件描述中的恶意脚本
export function storedXssExample13(fileMetadata) {
  // 危险：文件元数据可能包含恶意脚本
  const metadata = {
    fileId: fileMetadata.fileId,
    fileName: fileMetadata.fileName,
    description: fileMetadata.description,  // 可能包含恶意脚本
    uploadedBy: fileMetadata.uploadedBy
  };
  // 存储到数据库
  saveFileMetadataToDatabase(metadata);
  return metadata;
}

// 示例 14: 存储问卷调查答案中的恶意内容
export function storedXssExample14(surveyResponse) {
  // 危险：调查响应可能包含恶意脚本
  const response = {
    surveyId: surveyResponse.surveyId,
    questionId: surveyResponse.questionId,
    userId: surveyResponse.userId,
    answer: surveyResponse.answer  // 可能包含恶意脚本
  };
  // 存储到数据库
  saveSurveyResponseToDatabase(response);
  return response;
}

// 示例 15: 存储用户反馈中的恶意脚本
export function storedXssExample15(feedback) {
  // 危险：用户反馈内容直接存储
  const userFeedback = {
    userId: feedback.userId,
    subject: feedback.subject,
    message: feedback.message,  // 恶意脚本可能被存储
    submittedAt: new Date()
  };
  // 存储到数据库
  saveFeedbackToDatabase(userFeedback);
  return userFeedback;
}

// 示例 16: 存储社交网络帖子中的恶意内容
export function storedXssExample16(socialPost) {
  // 危险：社交帖子内容未经净化就存储
  const post = {
    userId: socialPost.userId,
    content: socialPost.content,  // 可能包含恶意脚本
    hashtags: socialPost.hashtags,
    sharedAt: new Date()
  };
  // 存储到数据库
  saveSocialPostToDatabase(post);
  return post;
}

// 示例 17: 存储用户简历中的恶意脚本
export function storedXssExample17(resumeData) {
  // 危险：简历数据可能包含恶意脚本
  const resume = {
    userId: resumeData.userId,
    headline: resumeData.headline,
    experience: resumeData.experience,  // 可能包含恶意脚本
    education: resumeData.education
  };
  // 存储到数据库
  saveResumeToDatabase(resume);
  return resume;
}

// 示例 18: 存储客户支持工单中的恶意内容
export function storedXssExample18(ticket) {
  // 危险：工单内容直接存储
  const supportTicket = {
    ticketId: ticket.ticketId,
    submitter: ticket.submitter,
    issue: ticket.issue,  // 恶意脚本可能被存储
    priority: ticket.priority
  };
  // 存储到数据库
  saveSupportTicketToDatabase(supportTicket);
  return supportTicket;
}

// 示例 19: 存储用户标签中的恶意脚本
export function storedXssExample19(tagData) {
  // 危险：标签数据可能包含恶意脚本
  const tag = {
    userId: tagData.userId,
    tagName: tagData.tagName,
    tagDescription: tagData.tagDescription  // 可能包含恶意脚本
  };
  // 存储到数据库
  saveTagToDatabase(tag);
  return tag;
}

// 示例 20: 存储复杂用户生成内容中的恶意脚本
export function storedXssExample20(ugcContent) {
  // 危险：用户生成内容未经净化就存储
  const content = {
    creatorId: ugcContent.creatorId,
    contentType: ugcContent.contentType,
    title: ugcContent.title,
    body: ugcContent.body,  // 恶意脚本可能被存储
    metadata: ugcContent.metadata,
    createdAt: new Date(),
    tags: ugcContent.tags,
    permissions: ugcContent.permissions
  };
  // 存储到数据库
  saveUgcToDatabase(content);
  return content;
}

// 模拟数据库保存函数
function saveCommentToDatabase(comment) { /* 实现数据库保存 */ }
function saveProfileToDatabase(profile) { /* 实现数据库保存 */ }
function saveBlogPostToDatabase(post) { /* 实现数据库保存 */ }
function saveForumPostToDatabase(post) { /* 实现数据库保存 */ }
function saveMessageToDatabase(msg) { /* 实现数据库保存 */ }
function saveReviewToDatabase(review) { /* 实现数据库保存 */ }
function saveWikiPageToDatabase(page) { /* 实现数据库保存 */ }
function saveNoteToDatabase(note) { /* 实现数据库保存 */ }
function saveTaskToDatabase(task) { /* 实现数据库保存 */ }
function saveChatMessageToDatabase(message) { /* 实现数据库保存 */ }
function saveConfigToDatabase(config) { /* 实现数据库保存 */ }
function saveLogEntryToDatabase(log) { /* 实现数据库保存 */ }
function saveFileMetadataToDatabase(metadata) { /* 实现数据库保存 */ }
function saveSurveyResponseToDatabase(response) { /* 实现数据库保存 */ }
function saveFeedbackToDatabase(feedback) { /* 实现数据库保存 */ }
function saveSocialPostToDatabase(post) { /* 实现数据库保存 */ }
function saveResumeToDatabase(resume) { /* 实现数据库保存 */ }
function saveSupportTicketToDatabase(ticket) { /* 实现数据库保存 */ }
function saveTagToDatabase(tag) { /* 实现数据库保存 */ }
function saveUgcToDatabase(content) { /* 实现数据库保存 */ }
