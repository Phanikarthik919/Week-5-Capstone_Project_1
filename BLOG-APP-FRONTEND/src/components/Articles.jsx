import React from 'react';
import Article from './Article';
import { articleGrid, loadingClass, emptyStateClass } from '../styles/common';

const Articles = ({
  articles = [],
  loading = false,
  showActions = false,
  onEdit,
  onDelete,
  onReadMore,
  emptyMessage = "No articles found."
}) => {
  if (loading) {
    return <div className={loadingClass}>Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className={emptyStateClass}>{emptyMessage}</div>;
  }

  return (
    <div className={articleGrid}>
      {articles.map((article) => (
        <Article
          key={article._id || article.id}
          article={article}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
          onReadMore={onReadMore}
        />
      ))}
    </div>
  );
};

export default Articles;
