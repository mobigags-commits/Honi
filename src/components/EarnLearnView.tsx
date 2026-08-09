import React, { useState } from 'react';
import { QuizCourse, Achievement } from '../types';
import { BookOpen, CheckCircle2, Award, Gift, ArrowRight, ShieldCheck } from 'lucide-react';

interface EarnLearnViewProps {
  courses: QuizCourse[];
  achievements: Achievement[];
  userPoints: number;
  onClaimDaily: () => void;
  onSubmitQuiz: (courseId: string, answers: Record<number, number>) => Promise<any>;
}

export const EarnLearnView: React.FC<EarnLearnViewProps> = ({
  courses,
  achievements,
  userPoints,
  onClaimDaily,
  onSubmitQuiz,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<QuizCourse | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (qId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleQuizSubmit = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    setQuizResult(null);
    try {
      const res = await onSubmitQuiz(selectedCourse.id, userAnswers);
      setQuizResult(res);
    } catch (err: any) {
      setQuizResult({ error: err.message || 'Submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Learn & Earn Academy</span>
          </div>
          <h1 className="text-3xl font-black text-white">Quizzes & Achievements</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Master Web3, blockchain security, and AVQ tokenomics. Earn points convertable directly to AVQ.
          </p>
        </div>

        <button
          onClick={onClaimDaily}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all whitespace-nowrap"
        >
          <Gift className="w-4 h-4" />
          <span>Claim Daily Login (+50 Pts)</span>
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Certification Quizzes</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-950 text-cyan-400 border border-slate-800">
                    {course.category}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    +{course.rewardPoints} Pts
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{course.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{course.description}</p>
              </div>

              <div className="pt-2">
                {course.completed ? (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Passed & Points Awarded</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setUserAnswers({});
                      setQuizResult(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1"
                  >
                    <span>Start Certification Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Badges Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Achievements & Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border space-y-2 transition-all ${
                ach.unlocked
                  ? 'bg-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">
                  +{ach.rewardPoints} Pts
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{ach.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{ach.description}</p>
              </div>
              <div className="text-[10px] font-mono text-purple-300">
                {ach.unlocked ? `Unlocked ${new Date(ach.unlockedAt!).toLocaleDateString()}` : 'Locked Milestone'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedCourse.title}</h3>
                <span className="text-xs text-cyan-400 font-mono">Score 100% to earn +{selectedCourse.rewardPoints} Points</span>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {selectedCourse.questions.map((q, idx) => (
                <div key={q.id} className="space-y-2">
                  <div className="text-xs font-bold text-slate-200">
                    Q{idx + 1}: {q.question}
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optionIdx) => (
                      <button
                        key={optionIdx}
                        onClick={() => handleAnswerSelect(q.id, optionIdx)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${
                          userAnswers[q.id] === optionIdx
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {quizResult && (
              <div className={`p-3 rounded-xl text-xs font-mono ${quizResult.passed ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'}`}>
                <div className="font-bold">{quizResult.passed ? '🎉 Passed!' : 'Failed'} Score: {quizResult.score}</div>
                <div>{quizResult.message || `Awarded +${quizResult.rewardPoints} Ledger Points.`}</div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={handleQuizSubmit}
                disabled={isSubmitting || Object.keys(userAnswers).length < selectedCourse.questions.length}
                className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Answers'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
