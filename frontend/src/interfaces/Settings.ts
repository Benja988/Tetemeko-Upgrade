// interfaces/Settings.ts

export interface Setting {
  id: string;         // Unique identifier for each setting
  label: string;      // The label for the setting (e.g., "Profile Image URL")
  type: 'text' | 'email' | 'number' | 'toggle' | 'select'; // The type of input (text, email, number, toggle, select)
  value: string | boolean | number;  // The current value of the setting
  category: string;   // Category to group the settings (e.g., 'Social Links', 'Appearance')
  description?: string;  // Optional description for the setting
  options?: string[];    // Options for select inputs
}
