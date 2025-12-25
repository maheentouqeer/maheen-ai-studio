import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import ImageUpload from "@/components/ui/ImageUpload";
import { Loader2, Plus, Pencil, Trash2, AlertCircle, Image as ImageIcon } from "lucide-react";

type TableName = keyof Database['public']['Tables'];

export type ColumnDef = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'image' | 'boolean';
  required?: boolean;
  options?: { label: string; value: string }[];
  optionsSource?: { table: TableName; value: string; label: string };
};

interface AdminCrudProps {
  table: TableName;
  columns: ColumnDef[];
}

const AdminCrud = ({ table, columns }: AdminCrudProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [optionsMap, setOptionsMap] = useState<Record<string, { label: string; value: string }[]>>({});

  const visibleColumns = useMemo(() => columns.filter(c => c.key !== 'id'), [columns]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load select options from sources
      const opt: Record<string, { label: string; value: string }[]> = {};
      await Promise.all(columns.map(async (c) => {
        if (c.type === 'select' && c.optionsSource) {
          const { data, error } = await (supabase.from as any)(c.optionsSource.table)
            .select(`${c.optionsSource.value}, ${c.optionsSource.label}`);
          if (!error && data) {
            opt[c.key] = data.map((r: any) => ({ 
              value: r[c.optionsSource!.value], 
              label: r[c.optionsSource!.label] 
            }));
          }
        } else if (c.type === 'select' && c.options) {
          opt[c.key] = c.options;
        }
      }));
      setOptionsMap(opt);

      const { data, error } = await (supabase.from as any)(table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      
      if (error) throw error;
      setRows(data || []);
    } catch (e: any) {
      console.error('Load data error:', e);
      toast({ 
        title: 'Failed to load data', 
        description: e.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [table]);

  const startEdit = (row?: any) => {
    setEditing(row || {});
    if (row) {
      // Ensure boolean fields are properly set
      const formData = { ...row };
      columns.forEach(col => {
        if (col.type === 'boolean' && formData[col.key] !== undefined) {
          formData[col.key] = Boolean(formData[col.key]);
        }
      });
      setForm(formData);
    } else {
      // Initialize with default values for new record
      const defaults: Record<string, any> = {};
      columns.forEach(col => {
        if (col.type === 'boolean') {
          defaults[col.key] = true;
        }
      });
      setForm(defaults);
    }
  };

  const cancel = () => {
    setEditing(null);
    setForm({});
  };

  const change = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      const missingFields = columns
        .filter(c => c.required && !form[c.key] && form[c.key] !== 0 && form[c.key] !== false)
        .map(c => c.label);
      
      if (missingFields.length > 0) {
        toast({ 
          title: 'Missing required fields', 
          description: `Please fill: ${missingFields.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Clean up form data
      const cleanedForm: Record<string, any> = {};
      columns.forEach(col => {
        if (form[col.key] !== undefined && form[col.key] !== '') {
          if (col.type === 'boolean') {
            cleanedForm[col.key] = Boolean(form[col.key]);
          } else if (col.type === 'number') {
            cleanedForm[col.key] = form[col.key] === null || form[col.key] === '' ? null : Number(form[col.key]);
          } else {
            cleanedForm[col.key] = form[col.key];
          }
        } else if (col.type === 'boolean') {
          cleanedForm[col.key] = false;
        }
      });

      if (editing && editing.id) {
        // Update existing record
        const { data, error } = await (supabase.from as any)(table)
          .update(cleanedForm)
          .eq('id', editing.id)
          .select('*')
          .maybeSingle();
        
        if (error) {
          console.error('Update error:', error);
          throw new Error(error.message);
        }
        
        console.log('Update successful:', data);
        toast({ 
          title: 'Updated successfully',
          description: `${table} entry has been updated.`
        });
      } else {
        // Create new record
        const { data, error } = await (supabase.from as any)(table)
          .insert(cleanedForm)
          .select('*')
          .maybeSingle();
        
        if (error) {
          console.error('Insert error:', error);
          throw new Error(error.message);
        }
        
        console.log('Insert successful:', data);
        toast({ 
          title: 'Created successfully',
          description: `New ${table} entry has been created.`
        });
      }
      
      // Reload data to ensure consistency
      await loadData();
      cancel();
    } catch (e: any) {
      console.error('Save error:', e);
      toast({ 
        title: 'Save failed', 
        description: e.message || 'An error occurred while saving. Please check your permissions.',
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(id);
      
      const { error } = await (supabase.from as any)(table)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete error:', error);
        throw new Error(error.message);
      }
      
      console.log('Delete successful for id:', id);
      
      // Reload data to ensure consistency
      await loadData();
      toast({ 
        title: 'Deleted successfully',
        description: `${table} entry has been removed.`
      });
    } catch (e: any) {
      console.error('Delete error:', e);
      toast({ 
        title: 'Delete failed', 
        description: e.message || 'An error occurred while deleting. Please check your permissions.',
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const renderCellValue = (row: any, col: ColumnDef) => {
    const value = row[col.key];
    
    if (col.type === 'image' && value) {
      return (
        <div className="flex items-center gap-2">
          <img 
            src={value} 
            alt="" 
            className="w-10 h-10 rounded object-cover border border-border"
            loading="lazy"
          />
        </div>
      );
    }
    
    if (col.type === 'boolean') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }
    
    if (col.type === 'select' && optionsMap[col.key]) {
      const option = optionsMap[col.key].find(o => o.value === value);
      return option?.label || '';
    }
    
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    
    return String(value ?? '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Data Table */}
      <div className="lg:col-span-2">
        <div className="overflow-x-auto rounded-xl border border-border bg-card/60 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr>
                {visibleColumns.slice(0, 4).map(c => (
                  <th key={c.key} className="text-left p-4 border-b border-border font-medium text-foreground">
                    {c.type === 'image' && <ImageIcon className="h-4 w-4 inline mr-1" />}
                    {c.label}
                  </th>
                ))}
                <th className="p-4 border-b border-border text-right font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  {visibleColumns.slice(0, 4).map(c => (
                    <td key={c.key} className="p-4 border-b border-border/50 align-middle">
                      {renderCellValue(r, c)}
                    </td>
                  ))}
                  <td className="p-4 border-b border-border/50 text-right whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => startEdit(r)}
                      className="hover:bg-primary/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-1 hover:bg-destructive/20 text-destructive" 
                      onClick={() => remove(r.id)}
                      disabled={deleting === r.id}
                    >
                      {deleting === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-8 text-center text-muted-foreground" colSpan={visibleColumns.slice(0, 4).length + 1}>
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No data yet. Create your first entry!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Panel */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-border p-5 bg-card/60 backdrop-blur-sm sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {editing?.id ? 'Edit Entry' : 'Create New'}
            </h3>
            {!editing && (
              <Button size="sm" onClick={() => startEdit()} className="btn-premium">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            )}
          </div>
          
          {editing !== null ? (
            <div className="space-y-4">
              {visibleColumns.map((c) => (
                <div key={c.key} className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {c.label}
                    {c.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  
                  {c.type === 'textarea' ? (
                    <Textarea 
                      value={form[c.key] ?? ''} 
                      onChange={(e) => change(c.key, e.target.value)} 
                      rows={3}
                      className="glass-input"
                      placeholder={`Enter ${c.label.toLowerCase()}`}
                    />
                  ) : c.type === 'number' ? (
                    <Input 
                      type="number" 
                      value={form[c.key] ?? ''} 
                      onChange={(e) => change(c.key, e.target.value === '' ? null : Number(e.target.value))}
                      className="glass-input"
                      placeholder={`Enter ${c.label.toLowerCase()}`}
                    />
                  ) : c.type === 'date' ? (
                    <Input 
                      type="date" 
                      value={form[c.key] ?? ''} 
                      onChange={(e) => change(c.key, e.target.value || null)}
                      className="glass-input"
                    />
                  ) : c.type === 'select' ? (
                    <Select 
                      onValueChange={(v) => change(c.key, v)} 
                      value={form[c.key] ?? ''}
                    >
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder={`Select ${c.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(optionsMap[c.key] || []).map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : c.type === 'boolean' ? (
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={Boolean(form[c.key])}
                        onCheckedChange={(checked) => change(c.key, checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {form[c.key] ? 'Yes' : 'No'}
                      </span>
                    </div>
                  ) : c.type === 'image' ? (
                    <ImageUpload 
                      value={form[c.key] ?? ''} 
                      onChange={(url) => change(c.key, url)}
                      placeholder={`Upload ${c.label}`}
                      path={`${table}/${c.key}`}
                    />
                  ) : (
                    <Input 
                      value={form[c.key] ?? ''} 
                      onChange={(e) => change(c.key, e.target.value)}
                      className="glass-input"
                      placeholder={`Enter ${c.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={save} 
                  className="flex-1 btn-premium"
                  disabled={saving}
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editing?.id ? 'Update' : 'Create'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={cancel}
                  className="glass-panel"
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click "New" to create an entry or select a row to edit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCrud;
