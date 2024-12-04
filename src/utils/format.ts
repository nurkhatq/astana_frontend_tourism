// src/utils/format.ts
export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};
  
  export const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };