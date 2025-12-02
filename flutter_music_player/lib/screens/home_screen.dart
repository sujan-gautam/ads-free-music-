import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/player_provider.dart';
import '../providers/library_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: _selectedIndex,
          children: [
            _buildHomeView(),
            _buildSearchView(),
            _buildLibraryView(),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildHomeView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.music_note,
            size: 100,
            color: Theme.of(context).colorScheme.primary,
          ),
          const SizedBox(height: 24),
          Text(
            'Flutter Music Player',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
          ),
          const SizedBox(height: 16),
          Text(
            'iOS App - Ready for Development',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.white70,
                ),
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {
              // TODO: Implement search
              setState(() => _selectedIndex = 1);
            },
            icon: const Icon(Icons.search),
            label: const Text('Start Searching'),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchView() {
    return Center(
      child: Text(
        'Search View\n(To be implemented)',
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: Colors.white70,
            ),
      ),
    );
  }

  Widget _buildLibraryView() {
    return Center(
      child: Text(
        'Library View\n(To be implemented)',
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: Colors.white70,
            ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() => _selectedIndex = index);
        },
        backgroundColor: Colors.transparent,
        indicatorColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Search',
          ),
          NavigationDestination(
            icon: Icon(Icons.library_music_outlined),
            selectedIcon: Icon(Icons.library_music),
            label: 'Library',
          ),
        ],
      ),
    );
  }
}
