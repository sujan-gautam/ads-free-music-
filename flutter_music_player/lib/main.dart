import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/storage_service.dart';
import 'providers/player_provider.dart';
import 'providers/library_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize storage
  await StorageService().initialize();
  
  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF0F172A),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PlayerProvider()),
        ChangeNotifierProvider(create: (_) => LibraryProvider()),
      ],
      child: MaterialApp(
        title: 'Music Player',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF0F172A),
          colorScheme: ColorScheme.dark(
            primary: const Color(0xFF8B5CF6),
            secondary: const Color(0xFF3B82F6),
            surface: const Color(0xFF1E293B),
            background: const Color(0xFF0F172A),
            error: const Color(0xFFEF4444),
          ),
          textTheme: GoogleFonts.interTextTheme(
            ThemeData.dark().textTheme,
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.transparent,
            elevation: 0,
            systemOverlayStyle: SystemUiOverlayStyle.light,
          ),
          cardTheme: CardTheme(
            color: const Color(0xFF1E293B).withOpacity(0.5),
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B5CF6),
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: const Color(0xFF1E293B).withOpacity(0.5),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
          sliderTheme: SliderThemeData(
            activeTrackColor: const Color(0xFF8B5CF6),
            inactiveTrackColor: const Color(0xFF1E293B),
            thumbColor: const Color(0xFF8B5CF6),
            overlayColor: const Color(0xFF8B5CF6).withOpacity(0.2),
            trackHeight: 4,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
          ),
          iconTheme: const IconThemeData(
            color: Colors.white70,
          ),
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
