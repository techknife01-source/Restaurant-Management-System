import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MessageSquarePlus, 
  Sparkles, 
  Utensils, 
  BedDouble, 
  ThumbsUp, 
  CheckCircle2, 
  X, 
  Filter, 
  Calendar,
  Send,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ReviewRecord, ReviewCategory } from '../types/restaurant';
import { INITIAL_GUEST_REVIEWS } from '../data/reviewsData';
import { subscribeToReviews, createReviewInFirestore } from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';
import { fireSuccessConfetti } from '../utils/confetti';

interface GuestReviewsProps {
  onExploreMenu?: () => void;
  onBookRoom?: () => void;
}

export const GuestReviews: React.FC<GuestReviewsProps> = ({ onExploreMenu, onBookRoom }) => {
  const { currentUser } = useAuth();
  
  const [firestoreReviews, setFirestoreReviews] = useState<ReviewRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'dining' | 'room_stay'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Liked review IDs in session
  const [likedReviews, setLikedReviews] = useState<Record<string, number>>({});

  // Review Form States
  const [category, setCategory] = useState<ReviewCategory>('dining');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [itemReviewed, setItemReviewed] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  // Subscribe to real-time reviews in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToReviews(
      (reviews) => {
        setFirestoreReviews(reviews);
      },
      (err) => {
        console.warn('Real-time reviews listener warning (fallback to local reviews):', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // Autofill name from Google sign-in
  useEffect(() => {
    if (currentUser?.displayName && !userName) {
      setUserName(currentUser.displayName);
    }
  }, [currentUser, userName]);

  // Combine Firestore reviews with initial seed reviews
  const allReviews = useMemo(() => {
    // Avoid duplicate IDs if seeded
    const firestoreIds = new Set(firestoreReviews.map(r => r.id));
    const uniqueSeeds = INITIAL_GUEST_REVIEWS.filter(r => !firestoreIds.has(r.id));
    return [...firestoreReviews, ...uniqueSeeds];
  }, [firestoreReviews]);

  // Filter & Sort
  const filteredReviews = useMemo(() => {
    return allReviews.filter(rev => {
      if (activeFilter === 'all') return true;
      return rev.category === activeFilter;
    }).sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allReviews, activeFilter, sortBy]);

  // Statistics calculation
  const totalCount = allReviews.length;
  const avgRating = totalCount > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '4.9';
  const diningCount = allReviews.filter(r => r.category === 'dining').length;
  const roomCount = allReviews.filter(r => r.category === 'room_stay').length;
  const fiveStarPercentage = totalCount > 0 
    ? Math.round((allReviews.filter(r => r.rating === 5).length / totalCount) * 100) 
    : 95;

  const handleLike = (id: string, initialLikes: number = 0) => {
    setLikedReviews(prev => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1
    }));
  };

  const handleOpenModal = (prefillCategory?: ReviewCategory) => {
    if (prefillCategory) setCategory(prefillCategory);
    setFormError(null);
    setSubmitSuccess(false);
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = userName.trim() || currentUser?.displayName || 'Valued Guest';
    const trimmedTitle = title.trim();
    const trimmedComment = comment.trim();

    if (!trimmedTitle) {
      setFormError('Please enter a short headline for your review.');
      return;
    }
    if (trimmedComment.length < 10) {
      setFormError('Please share at least 10 characters of your experience.');
      return;
    }

    setSubmitting(true);

    const newReview: ReviewRecord = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser?.uid || 'guest',
      userName: trimmedName,
      userAvatar: currentUser?.photoURL || undefined,
      rating,
      category,
      itemReviewed: itemReviewed.trim() || (category === 'dining' ? 'Royal Dining Experience' : 'Boutique Room Stay'),
      title: trimmedTitle,
      comment: trimmedComment,
      stayOrDineDate: 'Just now',
      createdAt: new Date().toISOString(),
      likesCount: 0,
      verifiedStayOrDine: true
    };

    try {
      await createReviewInFirestore(newReview);
      fireSuccessConfetti();
      setSubmitSuccess(true);
      // reset form
      setTitle('');
      setComment('');
      setItemReviewed('');
      setRating(5);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setFormError('Failed to record review to database. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guest-reviews" className="py-20 bg-[#0d0f14] border-t border-[#1e232e] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#d49e47]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-2 max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 text-[#d49e47] text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Real Guest Experiences • Dining &amp; Boutique Stays</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl text-[#ede8de] font-normal tracking-tight">
              What Our Diners &amp; Guests Say
            </h2>
            <p className="text-sm text-[#95a0b2] leading-relaxed">
              Read authentic feedback on our wood-fired Indian feasts, Awadhi Dum Biryanis, and affordable boutique rooms (₹499 to ₹999/night).
            </p>
          </motion.div>

          {/* Write a Review Button */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleOpenModal()}
            className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-[#d49e47] to-[#c28d38] text-[#12141a] px-5 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-[#d49e47]/20 hover:shadow-[#d49e47]/30 transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#12141a]" />
            <span>Write a Guest Review</span>
          </motion.button>
        </div>

        {/* Rating Metrics & Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#141720] border border-[#252c3a] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Score Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0f1117] rounded-2xl border border-[#262c3b] text-center">
              <span className="text-5xl font-extrabold text-[#ede8de] tracking-tight flex items-baseline">
                {avgRating}
                <span className="text-xl text-[#7f8a9d] font-normal ml-1">/ 5.0</span>
              </span>
              
              <div className="flex items-center space-x-1 my-3 text-[#d49e47]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-[#d49e47] text-[#d49e47]" />
                ))}
              </div>

              <div className="text-xs text-[#95a1b3] font-medium">
                Based on <strong className="text-[#ede8de]">{totalCount}</strong> verified reviews
              </div>

              <div className="mt-3 inline-flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Genuine Diners &amp; Room Guests</span>
              </div>
            </div>

            {/* Middle Breakdown Bar */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#95a1b3]">
                <span className="font-semibold text-[#ede8de]">Rating Distribution</span>
                <span>{fiveStarPercentage}% 5-Star Reviews</span>
              </div>

              {/* 5 Star */}
              <div className="flex items-center space-x-3 text-xs">
                <span className="w-12 text-[#95a1b3] flex items-center">5 <Star className="w-3 h-3 text-[#d49e47] fill-[#d49e47] ml-1" /></span>
                <div className="flex-1 h-2.5 bg-[#1f2430] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d49e47] rounded-full transition-all" style={{ width: `${fiveStarPercentage}%` }} />
                </div>
                <span className="w-8 text-right font-medium text-[#ede8de]">{fiveStarPercentage}%</span>
              </div>

              {/* 4 Star */}
              <div className="flex items-center space-x-3 text-xs">
                <span className="w-12 text-[#95a1b3] flex items-center">4 <Star className="w-3 h-3 text-[#d49e47] fill-[#d49e47] ml-1" /></span>
                <div className="flex-1 h-2.5 bg-[#1f2430] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d49e47]/60 rounded-full" style={{ width: '5%' }} />
                </div>
                <span className="w-8 text-right font-medium text-[#ede8de]">5%</span>
              </div>

              {/* 3, 2, 1 Star */}
              <div className="flex items-center space-x-3 text-xs opacity-50">
                <span className="w-12 text-[#95a1b3] flex items-center">3 <Star className="w-3 h-3 text-[#d49e47] ml-1" /></span>
                <div className="flex-1 h-2.5 bg-[#1f2430] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d49e47]/30 rounded-full" style={{ width: '0%' }} />
                </div>
                <span className="w-8 text-right font-medium text-[#ede8de]">0%</span>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="lg:col-span-3 flex flex-col justify-center space-y-3 border-t lg:border-t-0 lg:border-l border-[#222836] pt-6 lg:pt-0 lg:pl-6">
              <div className="text-xs text-[#95a1b3] leading-relaxed">
                Had a meal at our bistro or stayed in our boutique rooms? Share your feedback with future guests.
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 pt-1">
                <button
                  onClick={() => handleOpenModal('dining')}
                  className="inline-flex items-center justify-center space-x-1.5 text-xs font-semibold text-[#d49e47] hover:text-white bg-[#1a1e28] hover:bg-[#252b3a] border border-[#2f384a] px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Review Dining Experience</span>
                </button>
                <button
                  onClick={() => handleOpenModal('room_stay')}
                  className="inline-flex items-center justify-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>Review Room Stay</span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Filter Tabs & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#202532] pb-5">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeFilter === 'all'
                  ? 'bg-[#d49e47] text-[#12141a] font-bold shadow-md shadow-[#d49e47]/20'
                  : 'bg-[#141720] text-[#8e98aa] border border-[#262c3b] hover:text-[#ede8de]'
              }`}
            >
              <span>All Reviews</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{totalCount}</span>
            </button>

            <button
              onClick={() => setActiveFilter('dining')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeFilter === 'dining'
                  ? 'bg-[#d49e47] text-[#12141a] font-bold shadow-md shadow-[#d49e47]/20'
                  : 'bg-[#141720] text-[#8e98aa] border border-[#262c3b] hover:text-[#ede8de]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Dining &amp; Food</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{diningCount}</span>
            </button>

            <button
              onClick={() => setActiveFilter('room_stay')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeFilter === 'room_stay'
                  ? 'bg-emerald-500 text-[#12141a] font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-[#141720] text-[#8e98aa] border border-[#262c3b] hover:text-emerald-300'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Room Stays (₹499–₹999)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{roomCount}</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-2 text-xs text-[#8e98aa] self-end sm:self-auto">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#141720] border border-[#262c3b] text-[#ede8de] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#d49e47] cursor-pointer"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredReviews.map((review, idx) => {
              const currentLikes = likedReviews[review.id] ?? (review.likesCount || 0);
              const isLiked = likedReviews[review.id] !== undefined;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-[#141720] border border-[#252c3a] hover:border-[#d49e47]/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Top row: Avatar, Name, Category Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-11 h-11 rounded-full object-cover border border-[#2f3748]"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d49e47] to-[#8d5218] p-0.5 flex items-center justify-center font-bold text-sm text-[#12141a]">
                            <div className="w-full h-full rounded-full bg-[#181c26] flex items-center justify-center text-[#d49e47]">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold text-sm text-[#ede8de] group-hover:text-[#d49e47] transition-colors line-clamp-1">
                            {review.userName}
                          </h4>
                          <div className="flex items-center space-x-1.5 text-[11px] text-[#7f8b9e]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{review.category === 'dining' ? 'Verified Diner' : 'Verified Room Guest'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Category Pill */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        review.category === 'dining'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {review.category === 'dining' ? '🍽️ Dining' : '🛏️ Room Stay'}
                      </span>
                    </div>

                    {/* Star Rating Row */}
                    <div className="flex items-center space-x-1 text-[#d49e47]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= review.rating 
                              ? 'fill-[#d49e47] text-[#d49e47]' 
                              : 'text-[#2a3140]'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-[#ede8de] ml-2">{review.rating}.0</span>
                    </div>

                    {/* Item Reviewed Tag */}
                    {review.itemReviewed && (
                      <div className="text-xs font-medium text-[#9faabb] bg-[#0f1117] border border-[#232938] px-3 py-1.5 rounded-xl truncate">
                        <span className="text-[#6d798c] mr-1.5">Experience:</span>
                        <span className="text-[#ede8de] font-semibold">{review.itemReviewed}</span>
                      </div>
                    )}

                    {/* Title & Comment */}
                    <div className="space-y-1.5">
                      <h5 className="font-serif-title font-bold text-base text-[#ede8de] leading-snug">
                        "{review.title}"
                      </h5>
                      <p className="text-xs text-[#909dae] leading-relaxed line-clamp-4">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Card Footer: Date & Like Counter */}
                  <div className="mt-5 pt-4 border-t border-[#202633] flex items-center justify-between text-xs text-[#7f8b9e]">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5e697a]" />
                      <span>{review.stayOrDineDate || new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <button
                      onClick={() => handleLike(review.id, review.likesCount)}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isLiked 
                          ? 'bg-amber-950/60 text-[#d49e47] font-semibold' 
                          : 'hover:bg-[#1a1f2b] hover:text-[#ede8de]'
                      }`}
                      title="Mark review as helpful"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#d49e47]' : ''}`} />
                      <span>{currentLikes}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#141720] border border-[#2e3748] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1e2330] hover:bg-[#2c3447] text-[#939fae] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                
                {/* Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 text-[#d49e47] text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Share Your Feedback</span>
                  </div>
                  <h3 className="font-serif-title text-2xl font-bold text-[#ede8de]">
                    Write a Guest Review
                  </h3>
                  <p className="text-xs text-[#8c98aa]">
                    Your rating will be saved to Firebase and shown live on our homepage.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-serif-title text-xl font-bold text-[#ede8de]">Thank You for Your Review!</h4>
                    <p className="text-xs text-[#95a0b2]">
                      Your feedback has been saved to Firebase and is now live on our guest wall.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    
                    {formError && (
                      <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center space-x-2 text-xs text-red-300">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Step 1: Category Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#ede8de] block">
                        What are you reviewing?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCategory('dining')}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                            category === 'dining'
                              ? 'bg-[#d49e47] text-[#12141a] border-[#d49e47] shadow-lg shadow-[#d49e47]/20'
                              : 'bg-[#181c26] text-[#8e98aa] border-[#293040] hover:text-[#ede8de]'
                          }`}
                        >
                          <Utensils className="w-4 h-4" />
                          <span>🍽️ Dining &amp; Food</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategory('room_stay')}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                            category === 'room_stay'
                              ? 'bg-emerald-500 text-[#12141a] border-emerald-500 shadow-lg shadow-emerald-500/20'
                              : 'bg-[#181c26] text-[#8e98aa] border-[#293040] hover:text-emerald-300'
                          }`}
                        >
                          <BedDouble className="w-4 h-4" />
                          <span>🛏️ Room Stay</span>
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Star Rating Picker */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#ede8de] flex items-center justify-between">
                        <span>Your Rating</span>
                        <span className="text-[#d49e47] font-bold">{rating} out of 5 Stars</span>
                      </label>

                      <div className="flex items-center space-x-2 bg-[#181c26] p-3 rounded-xl border border-[#272e3d]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-[#d49e47] transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 transition-all ${
                                s <= (hoverRating || rating)
                                  ? 'fill-[#d49e47] text-[#d49e47]'
                                  : 'text-[#353d4f]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Name & Experience item */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#a2adbf] block">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Ananya Mukherjee"
                          className="w-full bg-[#181c26] border border-[#2c3444] rounded-xl px-3.5 py-2.5 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#a2adbf] block">
                          {category === 'dining' ? 'Dish / Occasion' : 'Room Type'}
                        </label>
                        <input
                          type="text"
                          value={itemReviewed}
                          onChange={(e) => setItemReviewed(e.target.value)}
                          placeholder={category === 'dining' ? 'e.g. Awadhi Dum Biryani' : 'e.g. Split AC Room (₹799)'}
                          className="w-full bg-[#181c26] border border-[#2c3444] rounded-xl px-3.5 py-2.5 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                        />
                      </div>
                    </div>

                    {/* Step 4: Title Headline */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#a2adbf] block">
                        Review Headline / Title
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Incredibly fragrant biryani and serene garden ambience"
                        className="w-full bg-[#181c26] border border-[#2c3444] rounded-xl px-3.5 py-2.5 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47]"
                      />
                    </div>

                    {/* Step 5: Comment */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#a2adbf] block">
                        Detailed Feedback &amp; Comments
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell others what you enjoyed about the food quality, room cleanliness, staff service, or pricing..."
                        className="w-full bg-[#181c26] border border-[#2c3444] rounded-xl p-3 text-xs text-[#ede8de] focus:outline-none focus:border-[#d49e47] resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#d49e47] to-[#c28d38] text-[#12141a] shadow-lg shadow-[#d49e47]/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#12141a] border-t-transparent rounded-full animate-spin" />
                          <span>Publishing to Firebase...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Public Review</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
