import React from 'react';
import { 
  articleCardClass, articleTitle, articleExcerpt, articleMeta, 
  tagClass, ghostBtn, primaryBtn, secondaryBtn 
} from '../styles/common';

const Article = ({ article, showActions = false, onEdit, onDelete, onReadMore }) => {
  return (
    <div className={articleCardClass}>
      <div className="flex flex-col h-full">
        <div className="mb-auto">
          {article.category && <div className={tagClass + " mb-2"}>{article.category}</div>}
          <h2 className={articleTitle + " mb-2"}>{article.title}</h2>
          <p className={articleExcerpt + " line-clamp-3 mb-4"}>
            {article.content}
          </p>
          <div className={articleMeta + " mb-4"}>
            <span className="font-medium">Published:</span> {new Date(article.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          {!showActions && (
            <button onClick={() => onReadMore?.(article)} className={ghostBtn}>
              Read More
            </button>
          )}
          
          {showActions && (
            <>
              <button 
                onClick={() => onEdit?.(article)} 
                className="text-[0.7rem] font-semibold text-[#0066cc] hover:underline"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete?.(article)} 
                className="text-[0.7rem] font-semibold text-[#ff3b30] hover:underline"
              >
                Deactivate
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
