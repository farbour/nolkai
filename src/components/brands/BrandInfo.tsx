import { BrandInfo as BrandInfoType } from '@/types/brand';
import { formatDate } from '@/utils/dateFormatter';

interface BrandInfoProps {
  info: BrandInfoType;
}

export function BrandInfo({ info }: BrandInfoProps) {
  const rating = info.reviews?.averageRating;
  const formattedRating = typeof rating === 'number' ? rating.toFixed(1) : 'N/A';
  
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Website & Social Media */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Website & Social Media</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Website</label>
            <p className="text-gray-900">{info.website || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Social Media</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(info.socials || {}).map(([platform, url]) => (
                url && (
                  <div key={platform} className="flex items-center space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                      {platform === 'instagram' && (
                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                      {platform === 'facebook' && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                      {platform === 'tiktok' && (
                        <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      )}
                      {platform === 'twitter' && (
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      )}
                      {platform === 'linkedin' && (
                        <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                      {platform === 'youtube' && (
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )}
                      {platform === 'pinterest' && (
                        <svg className="w-4 h-4 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium text-gray-500 capitalize block">
                        {platform}
                      </label>
                      <a
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate block"
                      >
                        {url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Positioning */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Brand Positioning</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900">{info.positioning?.description || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Target Market</label>
            <p className="text-gray-900">{info.positioning?.targetMarket || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Unique Selling Points</label>
            <ul className="list-disc list-inside mt-2">
              {info.positioning?.uniqueSellingPoints?.map((point, index) => (
                <li key={index} className="text-gray-900">{point}</li>
              )) || <li className="text-gray-500">No selling points available</li>}
            </ul>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Price Point</label>
            <p className="text-gray-900">{info.positioning?.pricePoint || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Competitors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Competitors</h3>
        {info.competitors?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {info.competitors.map((competitor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{competitor.name}</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{competitor.description}</p>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Strengths</label>
                    <ul className="list-disc list-inside mt-1">
                      {competitor.strengths?.map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-900">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Weaknesses</label>
                    <ul className="list-disc list-inside mt-1">
                      {competitor.weaknesses?.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-gray-900">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No competitor data available</p>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Reviews & Sentiment</h3>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <label className="text-sm font-medium text-gray-500">Overall Sentiment</label>
            <div className="mt-2 flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{info.reviews?.overallSentiment || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Average Rating</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <p className="text-3xl font-bold text-gray-900">
                  {formattedRating}
                </p>
                {typeof rating === 'number' && (
                  <div className="flex flex-col">
                    {renderStars(rating)}
                    <span className="text-sm text-gray-500 mt-1">
                      ({rating.toFixed(1)} out of 5)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <label className="text-sm font-medium text-green-700">Common Praises</label>
              </div>
              <ul className="space-y-3">
                {info.reviews?.commonPraises?.map((praise, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-800 flex-1">{praise}</span>
                  </li>
                )) || <li className="text-gray-500">No praises available</li>}
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <label className="text-sm font-medium text-red-700">Common Complaints</label>
              </div>
              <ul className="space-y-3">
                {info.reviews?.commonComplaints?.map((complaint, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-gray-800 flex-1">{complaint}</span>
                  </li>
                )) || <li className="text-gray-500">No complaints available</li>}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <label className="text-sm font-medium text-gray-700">Review Sources</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {info.reviews?.sources?.map((source, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-gray-700">{source}</span>
                </div>
              )) || (
                <div className="col-span-2 text-center py-4">
                  <span className="text-gray-500">No sources available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Last updated: {formatDate(info.lastUpdated)}
      </div>
    </div>
  );
}