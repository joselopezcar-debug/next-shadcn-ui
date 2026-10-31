"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Edit, AlertCircle, CheckCircle2 } from "lucide-react";

// --- ESTRUCTURAS DE DATOS ---
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  progress: number;
  membersCount: number;
}

interface TeamMember {
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: string;
  phone: string;
  projectId: string;
  isActive: boolean;
}

interface Task {
  id: string;
  description: string;
  projectId: string;
  status: "Completado" | "En progreso" | "Pendiente";
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  userId: string;
  dateline: string;
}

export default function DashboardPage() {
  // --- ESTADOS DE CARGA Y ALERTAS ---
  const [loading, setLoading] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // --- ESTADO DE PROYECTOS ---
  const [projects, setProjects] = useState<Project[]>([
    { id: "p1", title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "high", status: "En progreso", progress: 65, membersCount: 5 },
    { id: "p2", title: "Mobile App", description: "Aplicación móvil en React Native", category: "mobile", priority: "medium", status: "En revisión", progress: 90, membersCount: 3 },
  ]);
  const [newProject, setNewProject] = useState({ title: "", description: "", category: "", priority: "", membersCount: 1 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // --- ESTADO DE EQUIPO ---
  const [members, setMembers] = useState<TeamMember[]>([
    { userId: "u1", name: "María García", role: "Frontend Developer", email: "maria@example.com", position: "Líder Técnico", birthdate: "1995-04-12", phone: "987654321", projectId: "p1", isActive: true },
    { userId: "u2", name: "Juan Pérez", role: "Backend Developer", email: "juan@example.com", position: "Senior Dev", birthdate: "1990-08-23", phone: "912345678", projectId: "p2", isActive: true },
  ]);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({ name: "", role: "", email: "", position: "", birthdate: "", phone: "", projectId: "p1", isActive: true });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // --- ESTADO DE TAREAS Y PAGINACIÓN ---
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", description: "Implementar autenticación OAuth", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2026-11-15" },
    { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "u2", dateline: "2026-11-20" },
    { id: "t3", description: "Optimizar queries SQL de pedidos", projectId: "p1", status: "Completado", priority: "Urgente", userId: "u1", dateline: "2026-11-10" },
  ]);
  const [newTask, setNewTask] = useState<Partial<Task>>({ description: "", projectId: "p1", status: "Pendiente", priority: "Media", userId: "u1", dateline: "2026-12-01" });
  const [taskPage, setTaskPage] = useState(1);
  const tasksPerPage = 2;

  // --- ESTADO DE CONFIGURACIÓN ---
  const [settings, setSettings] = useState({ themeColor: "Slate", notificationsEmail: true, autoSave: true, language: "es" });

  const showFeedback = (type: "success" | "error", message: string) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 4000);
  };

  // --- OPERACIONES PROYECTOS ---
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.category) {
      showFeedback("error", "Por favor completa los campos obligatorios del proyecto.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const created: Project = {
        id: `p${Date.now()}`,
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        priority: newProject.priority || "low",
        status: "Planificado",
        progress: 0,
        membersCount: Number(newProject.membersCount) || 1,
      };
      setProjects([...projects, created]);
      setNewProject({ title: "", description: "", category: "", priority: "", membersCount: 1 });
      setLoading(false);
      showFeedback("success", "Proyecto creado correctamente.");
    }, 600);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    showFeedback("success", "Proyecto eliminado con éxito.");
  };

  // --- OPERACIONES EQUIPO (CRUD) ---
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) {
      showFeedback("error", "Ingresa al menos el nombre y correo del miembro.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (editingMember) {
        setMembers(members.map((m) => (m.userId === editingMember.userId ? ({ ...m, ...newMember } as TeamMember) : m)));
        setEditingMember(null);
        showFeedback("success", "Miembro del equipo actualizado.");
      } else {
        const created: TeamMember = {
          userId: `u${Date.now()}`,
          name: newMember.name || "",
          role: newMember.role || "Developer",
          email: newMember.email || "",
          position: newMember.position || "Developer",
          birthdate: newMember.birthdate || "2000-01-01",
          phone: newMember.phone || "900000000",
          projectId: newMember.projectId || "p1",
          isActive: newMember.isActive ?? true,
        };
        setMembers([...members, created]);
        showFeedback("success", "Nuevo miembro agregado.");
      }
      setNewMember({ name: "", role: "", email: "", position: "", birthdate: "", phone: "", projectId: "p1", isActive: true });
      setLoading(false);
    }, 600);
  };

  const handleDeleteMember = (userId: string) => {
    setMembers(members.filter((m) => m.userId !== userId));
    showFeedback("success", "Miembro del equipo eliminado.");
  };

  // --- OPERACIONES TAREAS (CRUD) ---
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.description) {
      showFeedback("error", "La descripción de la tarea es requerida.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const created: Task = {
        id: `t${Date.now()}`,
        description: newTask.description || "",
        projectId: newTask.projectId || "p1",
        status: (newTask.status as any) || "Pendiente",
        priority: (newTask.priority as any) || "Media",
        userId: newTask.userId || "u1",
        dateline: newTask.dateline || "2026-12-31",
      };
      setTasks([...tasks, created]);
      setNewTask({ description: "", projectId: "p1", status: "Pendiente", priority: "Media", userId: "u1", dateline: "2026-12-01" });
      setLoading(false);
      showFeedback("success", "Tarea registrada exitosamente.");
    }, 600);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    showFeedback("success", "Tarea eliminada.");
  };

  // Paginación
  const totalTaskPages = Math.ceil(tasks.length / tasksPerPage) || 1;
  const paginatedTasks = tasks.slice((taskPage - 1) * tasksPerPage, taskPage * tasksPerPage);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ENCABEZADO Y SPINNER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard de Proyectos</h1>
            <p className="text-slate-600">Sistema avanzado con componentes shadcn/ui y estado en memoria</p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-primary font-medium bg-white p-2 px-4 rounded-lg border shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando datos...</span>
            </div>
          )}
        </div>

        {/* ALERTA DE COMPONENTE SHADCN */}
        {alertInfo && (
          <Alert variant={alertInfo.type === "error" ? "destructive" : "default"}>
            {alertInfo.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertTitle>{alertInfo.type === "error" ? "Error de Validación" : "Operación Exitosa"}</AlertTitle>
            <AlertDescription>{alertInfo.message}</AlertDescription>
          </Alert>
        )}

        {/* TABS DE NAVEGACIÓN */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* TAB: RESUMEN */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Proyectos</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{projects.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Tareas Completadas</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{tasks.filter((t) => t.status === "Completado").length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Miembros Activos</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{members.filter((m) => m.isActive).length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Tareas Urgentes</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{tasks.filter((t) => t.priority === "Urgente").length}</div></CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: PROYECTOS */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Proyectos Activos</h2>
              <Dialog>
                <DialogTrigger>
                  <Button><Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                    <DialogDescription>Completa la información del proyecto.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Ej: Sistema Web" />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Input value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Detalles..." />
                    </div>
                    <div>
                      <Label>Categoría</Label>
                      <Select value={newProject.category} onValueChange={(val) => setNewProject({ ...newProject, category: val || ""})}>
                        <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Desarrollo Web</SelectItem>
                          <SelectItem value="mobile">Desarrollo Móvil</SelectItem>
                          <SelectItem value="design">Diseño UI/UX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Miembros del equipo</Label>
                      <Input type="number" value={newProject.membersCount} onChange={(e) => setNewProject({ ...newProject, membersCount: Number(e.target.value) })} />
                    </div>
                    <DialogFooter><Button type="submit">Guardar</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {projects.map((p) => (
                <Card key={p.id}>
                  <CardHeader>
                    <CardTitle>{p.title}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm"><span>Estado:</span><Badge variant="outline">{p.status}</Badge></div>
                    <div className="flex justify-between text-sm"><span>Miembros:</span><span className="font-semibold">{p.membersCount}</span></div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedProject(p)}>Ver detalles</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedProject && (
              <Dialog open={Boolean(selectedProject)} onOpenChange={() => setSelectedProject(null)}>
                <DialogContent>
                  <DialogHeader><DialogTitle>Detalles: {selectedProject.title}</DialogTitle></DialogHeader>
                  <div className="space-y-2 text-sm">
                    <p><strong>Descripción:</strong> {selectedProject.description}</p>
                    <p><strong>Categoría:</strong> {selectedProject.category}</p>
                    <p><strong>Progreso:</strong> {selectedProject.progress}%</p>
                    <p><strong>Miembros:</strong> {selectedProject.membersCount}</p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* TAB: EQUIPO (CRUD CAMPOS COMPLETOS) */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CRUD de Miembros del Equipo</CardTitle>
                <CardDescription>Gestión con campos: userId, role, name, email, position, birthdate, phone, projectId, isActive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSaveMember} className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-white shadow-sm">
                  <div><Label>Nombre</Label><Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} /></div>
                  <div><Label>Email</Label><Input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} /></div>
                  <div><Label>Rol</Label><Input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} /></div>
                  <div><Label>Posición</Label><Input value={newMember.position} onChange={(e) => setNewMember({ ...newMember, position: e.target.value })} /></div>
                  <div><Label>Teléfono</Label><Input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} /></div>
                  <div><Label>Fecha Nacimiento</Label><Input type="date" value={newMember.birthdate} onChange={(e) => setNewMember({ ...newMember, birthdate: e.target.value })} /></div>
                  <div>
                    <Label>Proyecto</Label>
                    <Select value={newMember.projectId} onValueChange={(val) => setNewMember({ ...newMember, projectId: val || ""})}>
                      <SelectTrigger><SelectValue placeholder="Proyecto" /></SelectTrigger>
                      <SelectContent>{projects.map((p) => (<SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={newMember.isActive} onCheckedChange={(val) => setNewMember({ ...newMember, isActive: val })} />
                    <Label>Activo</Label>
                  </div>
                  <div className="pt-6"><Button type="submit" className="w-full">{editingMember ? "Actualizar" : "Agregar Miembro"}</Button></div>
                </form>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UserID / Nombre</TableHead>
                      <TableHead>Rol / Posición</TableHead>
                      <TableHead>Email / Teléfono</TableHead>
                      <TableHead>F. Nacimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.userId}>
                        <TableCell><div className="font-semibold">{m.name}</div><div className="text-xs text-slate-500">{m.userId}</div></TableCell>
                        <TableCell><div>{m.role}</div><div className="text-xs text-slate-500">{m.position}</div></TableCell>
                        <TableCell><div>{m.email}</div><div className="text-xs text-slate-500">{m.phone}</div></TableCell>
                        <TableCell>{m.birthdate}</TableCell>
                        <TableCell><Badge variant={m.isActive ? "default" : "secondary"}>{m.isActive ? "Activo" : "Inactivo"}</Badge></TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingMember(m); setNewMember(m); }}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteMember(m.userId)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: TAREAS (CRUD + PAGINACIÓN) */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CRUD de Tareas del Proyecto</CardTitle>
                <CardDescription>Campos: description, projectId, status, priority, userId, dateline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-white shadow-sm">
                  <div className="md:col-span-2"><Label>Descripción</Label><Input value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} /></div>
                  <div>
                    <Label>Proyecto</Label>
                    <Select value={newTask.projectId} onValueChange={(val) => setNewTask({ ...newTask, projectId: val || ""})}>
                      <SelectTrigger><SelectValue placeholder="Proyecto" /></SelectTrigger>
                      <SelectContent>{projects.map((p) => (<SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Select value={newTask.status} onValueChange={(val: any) => setNewTask({ ...newTask, status: val })}>
                      <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En progreso">En progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Prioridad</Label>
                    <Select value={newTask.priority} onValueChange={(val: any) => setNewTask({ ...newTask, priority: val })}>
                      <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Asignado (UserID)</Label>
                    <Select value={newTask.userId} onValueChange={(val) => setNewTask({ ...newTask, userId: val || ""})}>
                      <SelectTrigger><SelectValue placeholder="Usuario" /></SelectTrigger>
                      <SelectContent>{members.map((m) => (<SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Dateline</Label><Input type="date" value={newTask.dateline} onChange={(e) => setNewTask({ ...newTask, dateline: e.target.value })} /></div>
                  <div className="md:col-span-2 pt-6"><Button type="submit" className="w-full">Crear Tarea</Button></div>
                </form>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Dateline</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTasks.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.description}</TableCell>
                        <TableCell><Badge variant="outline">{t.status}</Badge></TableCell>
                        <TableCell><Badge variant={t.priority === "Urgente" ? "destructive" : "default"}>{t.priority}</Badge></TableCell>
                        <TableCell>{members.find((m) => m.userId === t.userId)?.name || t.userId}</TableCell>
                        <TableCell>{t.dateline}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteTask(t.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* COMPONENTE PAGINATION DE SHADCN */}
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setTaskPage((p) => Math.max(p - 1, 1)); }} />
                    </PaginationItem>
                    {Array.from({ length: totalTaskPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={taskPage === i + 1} onClick={(e) => { e.preventDefault(); setTaskPage(i + 1); }}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setTaskPage((p) => Math.min(p + 1, totalTaskPages)); }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: CONFIGURACIÓN */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Configuración</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <Label>Notificaciones por correo</Label>
                  <Switch checked={settings.notificationsEmail} onCheckedChange={(val) => setSettings({ ...settings, notificationsEmail: val })} />
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <Label>Guardado automático</Label>
                  <Switch checked={settings.autoSave} onCheckedChange={(val) => setSettings({ ...settings, autoSave: val })} />
                </div>
                <Button onClick={() => showFeedback("success", "Configuración guardada correctamente.")}>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
