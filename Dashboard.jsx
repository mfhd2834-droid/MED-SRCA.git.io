import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ onCitySelect, statisticsData, userRole, isLoading }) => {
  const [currentStatistics, setCurrentStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  const cities = [
    'المدينة',
    'العلا', 
    'ينبع',
    'الحناكية',
    'مهد الذهب',
    'بدر',
    'خيبر',
    'وادي الفرع',
    'العيص'
  ];

  // ألوان التصنيفات الصحيحة
  const categoryColors = {
    'الاداري‬‏': '#8B4513',      // بني
    '‫البيئة‬‏': '#28a745',       // أخضر
    'الإعلامي': '#007bff',     // أزرق
    '‫المجال الاسعافي‬‏': '#dc3545',     // أحمر
    '‫التعليم‬‏': '#ffc107',      // أصفر
    '‫المساعدات‬‏ ‫الانسانية‬‏': '#000000'      // أسود
  };

  const loadCurrentStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/statistics/current');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCurrentStatistics(result.data);
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentStatistics();
  }, []);

  const getMonthName = (month) => {
    const months = {
      1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل',
      5: 'مايو', 6: 'يونيو', 7: 'يوليو', 8: 'أغسطس',
      9: 'سبتمبر', 10: 'أكتوبر', 11: 'نوفمبر', 12: 'ديسمبر'
    };
    return months[month] || month;
  };

    const getCityData = (city) => {
    if (!currentStatistics || !currentStatistics.data || !currentStatistics.data[city]) {
      return { totalVolunteers: 0, categories: [], details: [] };
    }

    const cityData = currentStatistics.data[city];
    const categories = cityData.data.map(item => ({
      name: item.name,
      value: item.value,
      color: categoryColors[item.name] || '#6c757d'
    }));

    const totalVolunteers = cityData.totalVolunteers;
    const details = cityData.details || [];

    return { totalVolunteers, categories, details };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  const hasData = currentStatistics && currentStatistics.data && Object.keys(currentStatistics.data).length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">الصفحة الرئيسية</h1>
        <p className="text-gray-600">إحصائيات التطوع في محافظة المدينة المنورة</p>
      </div>

      {/* شرح الألوان في الأعلى */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>شرح الألوان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8B4513' }}></div>
              <span className="text-sm">إداري</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#28a745' }}></div>
              <span className="text-sm">بيئة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#007bff' }}></div>
              <span className="text-sm">إعلامي</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dc3545' }}></div>
              <span className="text-sm">إسعافي</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ffc107' }}></div>
              <span className="text-sm">تعليم</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#000000' }}></div>
              <span className="text-sm">إنساني</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl text-gray-600 mb-4">محافظة المدينة المنورة</h2>
        
      {hasData ? (
        <div className="bg-green-50 p-4 rounded-lg inline-block mb-6">
          <p className="text-green-800">
            آخر تحديث: {new Date(currentStatistics.upload_date).toLocaleDateString('ar-SA')} 
            • الفترة: {getMonthName(currentStatistics.month)} {currentStatistics.year}
            • إجمالي المتطوعين: <span className="font-bold">{currentStatistics.total_volunteers}</span>
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg inline-block mb-6">
          <p className="text-blue-800">لا توجد إحصائيات متاحة حالياً. يرجى رفع ملف Excel لعرض البيانات.</p>
        </div>
      )}

      {/* شبكة المدن */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => {
          const cityData = getCityData(city);
          
          return (
            <Card 
              key={city} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => onCitySelect && onCitySelect(city, cityData.details)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  {cityData.totalVolunteers > 0 ? (
                    <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold text-2xl">
                      {cityData.totalVolunteers}
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      0
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{city}</h3>
                <div className="text-sm text-gray-600">
                  <p>المتطوعون: {cityData.totalVolunteers}</p>
                  <p>التصنيفات: {cityData.categories.filter(cat => cat.value > 0).length}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المدن</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cities.map(city => ({
                  name: city,
                  volunteers: getCityData(city).totalVolunteers
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volunteers" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>توزيع المتطوعين</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cities.map(city => ({
                      name: city,
                      value: getCityData(city).totalVolunteers
                    })).filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#dc2626" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

