import { useState } from 'react';
import { Box, Typography, useTheme, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Link } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import HandshakeIcon from '@mui/icons-material/Handshake';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ArticleIcon from '@mui/icons-material/Article';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const versionHistory = [
    {
        version: '1.0.0',
        date: '2026-09-28',
        changes: [
            'Первоначальный релиз приложения',
            'Добавлен калькулятор WB',
            'Добавлен поиск товаров',
        ],
    },
    // Add more versions as needed
];

export const Footer = () => {
    const theme = useTheme();
    const muiTheme = useMuiTheme();
    const [openVersionDialog, setOpenVersionDialog] = useState(false);
    const currentYear = new Date().getFullYear();
    const appVersion = '1.0.0';

    const handleVersionClick = () => {
        setOpenVersionDialog(true);
    };

    const handleCloseVersionDialog = () => {
        setOpenVersionDialog(false);
    };

    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                py: 2,
                backgroundColor: muiTheme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.03)'
                    : 'rgba(255, 255, 255, 0.05)',
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    px: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {/* Left side - Version */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="История версий">
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            onClick={handleVersionClick}
                            sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <CodeIcon fontSize="small" />
                            v{appVersion}
                        </Typography>
                    </Tooltip>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                        <Tooltip title="Сотрудничество">
                            <IconButton size="small" color="inherit" sx={{ color: 'text.secondary' }}>
                                <HandshakeIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Соглашение">
                            <IconButton size="small" color="inherit" sx={{ color: 'text.secondary' }}>
                                <ArticleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Обратная связь">
                            <IconButton size="small" color="inherit" sx={{ color: 'text.secondary' }}>
                                <FeedbackIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Right side - Copyright and Net-Brain link */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        © {currentYear} WB Tools
                    </Typography>
                    <Link
                        href="https://net-brain.ru"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        sx={{
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Net-Brain.ru
                        <OpenInNewIcon fontSize="inherit" />
                    </Link>
                </Box>
            </Box>

            {/* Version History Dialog */}
            <Dialog
                open={openVersionDialog}
                onClose={handleCloseVersionDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>История версий</DialogTitle>
                <DialogContent>
                    {versionHistory.map((version, index) => (
                        <Box key={version.version} sx={{ mb: index < versionHistory.length - 1 ? 3 : 0 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Версия {version.version} - {version.date}
                            </Typography>
                            <Box component="ul" sx={{ m: '8px 0 0 0', pl: 3, '& > li': { listStyleType: 'disc' } }}>
                                {version.changes.map((change, i) => (
                                    <li key={i}>
                                        <Typography variant="body2" color="text.secondary">
                                            {change}
                                        </Typography>
                                    </li>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVersionDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Footer;
