import { useState } from 'react';
import { UnitConverter } from '@/components/features/unit-converter/UnitConverter';
import { WbSearch } from '@/components/features/wb-search/WbSearch';
import CalculateIcon from '@mui/icons-material/Calculate';
import SearchIcon from '@mui/icons-material/Search';
import MainLayout from '@/components/layout/MainLayout';
import { Box, Typography, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';
import './App.css';

type Tab = 'calculator' | 'search';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');

  return (
    <MainLayout>
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto',
        py: 4,
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            WB Tools
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Набор инструментов для работы с Wildberries
          </Typography>
          
          {/* Navigation Tabs */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            mb: 4
          }}>
            <button
              onClick={() => setActiveTab('calculator')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s',
                backgroundColor: activeTab === 'calculator' ? '#1976d2' : 'transparent',
                color: activeTab === 'calculator' ? '#fff' : 'inherit',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <CalculateIcon sx={{ mr: 1 }} />
              Калькулятор
            </button>
            <button
              onClick={() => setActiveTab('search')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s',
                backgroundColor: activeTab === 'search' ? '#1976d2' : 'transparent',
                color: activeTab === 'search' ? '#fff' : 'inherit',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              Поиск товаров
            </button>
          </Box>
        </Box>
        
        <Box sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          p: 3,
          mt: 2
        }}>
          {activeTab === 'calculator' ? <UnitConverter /> : <WbSearch />}
        </Box>
      </Box>
    </MainLayout>
  );
}

export default App;
