"use client"

import { GoogleAnalytics } from '@next/third-parties/google'
import { useEffect } from 'react'

interface GoogleAnalyticsProps {
  gaId: string
}

// Google Analytics Events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Specific tracking functions for salary platform
export const salaryTracking = {
  calculatorUse: (golongan: string, kementerian?: string) => {
    trackEvent('calculate_salary', 'salary_calculator', `${golongan}${kementerian ? `_${kementerian}` : ''}`)
  },
  
  dataExport: (format: string, dataType: string) => {
    trackEvent('export_data', 'data_interaction', `${format}_${dataType}`)
  },
  
  searchQuery: (query: string, resultsCount: number) => {
    trackEvent('search', 'data_search', query, resultsCount)
  },
  
  filterApply: (filterType: string, filterValue: string) => {
    trackEvent('apply_filter', 'data_filtering', `${filterType}_${filterValue}`)
  },
  
  chartInteraction: (chartType: string, action: string) => {
    trackEvent('chart_interaction', 'data_visualization', `${chartType}_${action}`)
  },
  
  officialView: (officialType: string) => {
    trackEvent('view_official', 'officials_directory', officialType)
  },
  
  languageSwitch: (fromLang: string, toLang: string) => {
    trackEvent('language_switch', 'internationalization', `${fromLang}_to_${toLang}`)
  }
}

export function AnalyticsProvider({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [gaId])

  return <GoogleAnalytics gaId={gaId} />
}