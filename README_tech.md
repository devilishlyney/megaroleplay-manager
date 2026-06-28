# MegaRolePlay Manager — Documentation Technique

## Architecture

Application desktop (Tauri v2 + React + TypeScript) avec backend Supabase (PostgreSQL, Auth, Storage). Architecture MVC adaptée :

- **Model** (`src/model/`) : Interfaces TypeScript uniquement.
- **View** (`src/view/`) : Composants et pages UI.
- **Controller** (`src/controller/`) : Services (appels Supabase), utils (logique pure), hooks, store Zustand, context Auth.

## Structure
src/ ├── model/ # Types & Interfaces 
     ├── view/ 
        │ 
        ├── components/ # Composants réutilisables 
        │ └── pages/ # Écrans 
     ├── controller/ 
        │ 
        ├── services/ # auth, characters, campaigns, friends, supabase 
        │ 
        ├── utils/ # dndRules.ts (Point Buy) 
        │ 
        ├── hooks/ # useAuth 
        │ 
        ├── context/ # AuthContext 
        │ 
        └── store/ # Zustand (wizard) 
     ├── App.tsx # Routes (React Router) 
     └── main.tsx # Providers

## Frontend	
React, TypeScript, Vite, Tauri v2, React Router, Zustand

## Backend
Supabase (PostgreSQL, Auth, Storage, RLS, Triggers)

## Base de données

### Tables principales :

    characters : id, owner_id, name, race, class, level, base_stats (jsonb), appearance (jsonb), inventory (text[]), lore
    campaigns : id, owner_id, name, description, status, start_date, end_date
    campaign_characters : id, campaign_id, character_id, role (table de liaison)
    friendships : id, requester_id, addressee_id, status
    public_profiles : id, username (unique), display_name, avatar_url
    races : id, name, traits (jsonb), ability_bonuses (jsonb)
    classes : id, name, hit_die, proficiencies (jsonb), features (jsonb)

### Sécurité

    RLS sur toutes les tables : accès limité à auth.uid() = owner_id (ou équivalent pour les amis).
    Triggers SQL : on_auth_user_created (crée profil public), on_auth_user_updated (sync métadonnées).

### Thème

Clair/sombre via CSS Custom Properties (data-theme sur <html>). Sauvegarde localStorage. Thème système par défaut au premier lancement.