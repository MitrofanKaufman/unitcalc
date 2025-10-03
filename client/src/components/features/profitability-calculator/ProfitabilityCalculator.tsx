import { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  List, 
  ListItemButton,
  ListItemText, 
  Paper, 
  Popper, 
  ClickAwayListener,
  CircularProgress,
  LinearProgress,
  Alert,
  Drawer,
  Box,
  Grid,
  InputAdornment,
  Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { SearchBar } from '@/components/common/SearchBar';
import type { Product } from '@/types';
import { useProductSearch } from '@/hooks/useProductSearch';
import styles from './ProfitabilityCalculator.module.css';
import CalculatorForm from './components/CalculatorForm';

const MARKETPLACES = {
  wb: { name: 'Wildberries' },
  ozon: { name: 'Ozon' },
  yandex: { name: 'Яндекс.Маркет' },
  sber: { name: 'СберМегаМаркет' },
  other: { name: 'Другая площадка' }
} as const;

interface MarketplaceProduct extends Omit<Product, 'marketplace' | 'weight' | 'dimensions' | 'length' | 'width' | 'height' | 'brand' | 'rating' | 'reviews'> {
  id: string;
  name: string;
  price: number;
  marketplace: 'wb' | 'ozon' | 'yandex' | 'sber' | 'other';
  characteristics: {
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    brand?: string;
    rating?: number;
    reviews?: number;
  };
  inStock?: boolean;
}
export function ProfitabilityCalculator() {
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Use the product search hook
  const {
    query,
    setQuery,
    suggestions,
    products,
    loading,
    error,
    hasMore,
    progress,
    showSuggestions,
    highlightedIndex,
    fetchSuggestions,
    fetchProducts,
    handleSuggestionSelect,
    handleKeyDown,
    loadMore,
    setShowSuggestions
  } = useProductSearch();

  // Обработчик изменения поискового запроса
  const handleSearchChange = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length > 1) {
      fetchSuggestions(searchQuery);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Обработчик отправки поискового запроса
  const handleSearch = (searchQuery: string) => {
    fetchProducts(searchQuery);
    setShowSuggestions(false);
  };

  // Обработчик клика вне области подсказок
  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const handleProductSelect = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
  };

  const handleCloseCalculator = () => {
    setSelectedProduct(null);
  };
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="temporary"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px',
            height: 'calc(100% - 64px)',
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Menu</Typography>
          <List>
            <ListItemButton onClick={() => setMenuOpen(false)}>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={() => setMenuOpen(false)}>
              <ListItemText primary="Settings" />
            </ListItemButton>
            <ListItemButton onClick={() => setMenuOpen(false)}>
              <ListItemText primary="About" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      
      <Box 
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          marginLeft: menuOpen ? '240px' : '0', 
          transition: 'margin-left 0.3s ease-in-out',
          width: menuOpen ? 'calc(100% - 240px)' : '100%'
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      
        {progress.progress > 0 && progress.progress < 100 && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={progress.progress} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progress.progress)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {progress.status}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box position="relative" sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <SearchBar
                  inputRef={searchInputRef}
                  placeholder="Введите артикул или название товара..."
                  onSearch={handleSearch}
                  value={query}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                    if (e.key === 'Enter') {
                      handleSearch(query);
                    }
                  }}
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      paddingLeft: '16px',
                      borderRadius: '12px',
                      backgroundColor: 'background.paper',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Box>
              <Popper
                open={showSuggestions && suggestions.length > 0}
                anchorEl={searchInputRef.current}
                placement="bottom-start"
                style={{
                  width: searchInputRef.current?.clientWidth,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1300
                }}
              >
                <Paper elevation={3} sx={{ borderRadius: '8px', mt: 1 }}>
                  <List>
                    {suggestions.map((suggestion, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={styles.suggestionItem}
                        sx={{
                          backgroundColor: highlightedIndex === index ? 'action.hover' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemText primary={suggestion} />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              </Popper>
            </Box>
          </ClickAwayListener>
        </Box>
      
        <Box className={styles.productsGrid} sx={{ maxWidth: '1000px', mx: 'auto', px: 2 }}>
          {loading ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 4,
              width: '100%'
            }}>
              <CircularProgress />
            </Box>
          ) : products.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                {products.map((product) => {
                  const marketplaceProduct: MarketplaceProduct = {
                    ...product,
                    characteristics: product.characteristics || {},
                    marketplace: product.marketplace as 'wb' | 'ozon' | 'yandex' | 'sber' | 'other'
                  };
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={marketplaceProduct.id}>
                      <Card
                        className={styles.productCard}
                        onClick={() => handleProductSelect(marketplaceProduct)}
                      >
                        <CardContent className={styles.productContent}>
                          <Typography variant="h6" className={styles.productTitle}>
                            {marketplaceProduct.name}
                          </Typography>
                          <div className={styles.productFooter}>
                            <Typography variant="h6" className={styles.productPrice}>
                              {marketplaceProduct.price?.toLocaleString('ru-RU')} ₽
                            </Typography>
                            <Chip
                              label={String(MARKETPLACES[marketplaceProduct.marketplace]?.name || marketplaceProduct.marketplace)}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={marketplaceProduct.characteristics?.brand || 'Без бренда'}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              {hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={loadMore}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Загрузка...' : 'Загрузить еще'}
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4, width: '100%' }}>
              <Typography variant="h6">Ничего не найдено</Typography>
              <Typography variant="body1" color="text.secondary">
                Попробуйте изменить параметры поиска
              </Typography>
            </Box>
          )}

          {selectedProduct && (
            <CalculatorForm
              product={selectedProduct}
              onClose={handleCloseCalculator}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProfitabilityCalculator;
