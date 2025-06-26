const generateAttentionCards = (candidates) => {
  const now = new Date();
  
  // Pending reviews (status is Applied)
  const pendingReviews = candidates.filter(
    candidate => candidate.status === 'Applied'
  ).length;
  
  // Upcoming interviews (within next 7 days)
  const upcomingInterviews = candidates.filter(candidate => {
    if (!candidate.interviewDate) return false;
    const interviewDate = new Date(candidate.interviewDate);
    return interviewDate > now && interviewDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }).length;
  
  // Onboarding tasks (status is Hired)
  const onboardingTasks = candidates.filter(
    candidate => candidate.status === 'Hired'
  ).length;
  
  return [
    {
      title: 'Pending Reviews',
      count: pendingReviews,
      description: 'Candidates awaiting initial review',
      priority: pendingReviews > 0 ? 'high' : 'none',
    },
    {
      title: 'Upcoming Interviews',
      count: upcomingInterviews,
      description: 'Interviews scheduled within the next 7 days',
      priority: upcomingInterviews > 0 ? 'medium' : 'none',
    },
    {
      title: 'Onboarding Tasks',
      count: onboardingTasks,
      description: 'New hires to be onboarded',
      priority: onboardingTasks > 0 ? 'low' : 'none',
    },
  ];
};

module.exports = { generateAttentionCards };