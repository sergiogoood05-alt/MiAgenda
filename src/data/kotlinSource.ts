export const MAIN_ACTIVITY_KT = `package com.example.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

// Niveles de prioridad con su etiqueta y color visual
enum class Prioridad(val etiqueta: String, val color: Color) {
    BAJA("Baja", Color(0xFF0D9488)),
    MEDIA("Media", Color(0xFFD97706)),
    ALTA("Alta", Color(0xFFDC2626))
}

// Modelo de datos en memoria para cada actividad
data class Actividad(
    val id: Int,
    val nombre: String,
    val fecha: LocalDate,
    val prioridad: Prioridad,
    val completada: Boolean = false
)

// Esquemas de color claro y oscuro globales
private val EsquemaClaro = lightColorScheme(
    primary = Color(0xFF2563EB),
    background = Color(0xFFF6F8FA),
    surface = Color.White,
    onBackground = Color(0xFF0F172A),
    onSurface = Color(0xFF0F172A),
    onSurfaceVariant = Color(0xFF64748B)
)

private val EsquemaOscuro = darkColorScheme(
    primary = Color(0xFF3B82F6),
    background = Color(0xFF020617),
    surface = Color(0xFF0F172A),
    onBackground = Color(0xFFF1F5F9),
    onSurface = Color(0xFFF1F5F9),
    onSurfaceVariant = Color(0xFF94A3B8)
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // Estado global para alternar entre modo claro y modo oscuro
            var modoOscuro by remember { mutableStateOf(false) }

            MaterialTheme(
                colorScheme = if (modoOscuro) EsquemaOscuro else EsquemaClaro
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MiAgendaScreen(
                        modoOscuro = modoOscuro,
                        onToggleModoOscuro = { modoOscuro = !modoOscuro }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaScreen(
    modoOscuro: Boolean,
    onToggleModoOscuro: () -> Unit
) {
    // Lista en memoria: se conserva mientras la aplicación esté abierta
    val actividades = remember { mutableStateListOf<Actividad>() }
    var siguienteId by remember { mutableIntStateOf(1) }

    // Estados del formulario de creación
    var textoActividad by remember { mutableStateOf("") }
    var fechaSeleccionada by remember { mutableStateOf<LocalDate?>(null) }
    var prioridadSeleccionada by remember { mutableStateOf(Prioridad.MEDIA) }
    var mensajeError by remember { mutableStateOf<String?>(null) }
    var mostrarSelectorFecha by remember { mutableStateOf(false) }

    // Estado de la barra de búsqueda y filtro por prioridad
    var textoBusqueda by remember { mutableStateOf("") }
    var filtroPrioridad by remember { mutableStateOf<Prioridad?>(null) }

    // Estado para editar una actividad existente
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }

    val formatoFecha = remember {
        DateTimeFormatter.ofPattern("d MMM yyyy", Locale("es", "ES"))
    }

    // Cálculo del progreso de tareas completadas
    val totalTareas = actividades.size
    val tareasCompletadas = actividades.count { it.completada }
    val porcentajeCompletado = if (totalTareas > 0) {
        (tareasCompletadas * 100) / totalTareas
    } else {
        0
    }

    // Filtrado en tiempo real por nombre y prioridad seleccionada
    val actividadesFiltradas = remember(actividades.toList(), textoBusqueda, filtroPrioridad) {
        val consulta = textoBusqueda.trim()
        actividades.filter { actividad ->
            val coincidePrioridad = filtroPrioridad == null || actividad.prioridad == filtroPrioridad
            val coincideNombre = consulta.isEmpty() || actividad.nombre.contains(consulta, ignoreCase = true)
            coincidePrioridad && coincideNombre
        }
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Mi Agenda",
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                    titleContentColor = MaterialTheme.colorScheme.onSurface
                ),
                actions = {
                    IconButton(onClick = onToggleModoOscuro) {
                        Icon(
                            imageVector = if (modoOscuro) {
                                Icons.Default.LightMode
                            } else {
                                Icons.Default.DarkMode
                            },
                            contentDescription = if (modoOscuro) {
                                "Cambiar a modo claro"
                            } else {
                                "Cambiar a modo oscuro"
                            }
                        )
                    }
                }
            )
        }
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            // 1. Formulario para agregar nueva actividad
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    OutlinedTextField(
                        value = textoActividad,
                        onValueChange = { nuevoTexto ->
                            textoActividad = nuevoTexto
                            if (nuevoTexto.isNotBlank()) {
                                mensajeError = null
                            }
                        },
                        label = { Text("Escribe una actividad") },
                        singleLine = true,
                        isError = mensajeError != null,
                        modifier = Modifier.fillMaxWidth()
                    )

                    if (mensajeError != null) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = mensajeError!!,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Selector de fecha (usa hoy si no se elige ninguna)
                    val fechaMostrada = fechaSeleccionada ?: LocalDate.now()
                    OutlinedButton(
                        onClick = { mostrarSelectorFecha = true },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            imageVector = Icons.Default.CalendarToday,
                            contentDescription = "Elegir fecha",
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (fechaSeleccionada == null) {
                                "Fecha: Hoy (\${fechaMostrada.format(formatoFecha)})"
                            } else {
                                "Fecha: \${fechaMostrada.format(formatoFecha)}"
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Selector de prioridad: Baja, Media, Alta
                    Text(
                        text = "Prioridad",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Prioridad.entries.forEach { nivel ->
                            FilterChip(
                                selected = prioridadSeleccionada == nivel,
                                onClick = { prioridadSeleccionada = nivel },
                                label = { Text(nivel.etiqueta) },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = {
                            val nombreLimpio = textoActividad.trim()
                            if (nombreLimpio.isEmpty()) {
                                mensajeError = "Debes escribir una actividad antes de agregar."
                            } else {
                                val nuevaActividad = Actividad(
                                    id = siguienteId++,
                                    nombre = nombreLimpio,
                                    fecha = fechaSeleccionada ?: LocalDate.now(),
                                    prioridad = prioridadSeleccionada
                                )
                                actividades.add(0, nuevaActividad)
                                textoActividad = ""
                                fechaSeleccionada = null
                                prioridadSeleccionada = Prioridad.MEDIA
                                mensajeError = null
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Agregar actividad")
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 2. Tarjeta de resumen de progreso
            ResumenProgresoCard(
                total = totalTareas,
                completadas = tareasCompletadas,
                porcentaje = porcentajeCompletado
            )

            Spacer(modifier = Modifier.height(14.dp))

            // 3. Barra de búsqueda en tiempo real encima de la lista
            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                placeholder = { Text("Buscar actividad por nombre...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Buscar"
                    )
                },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Limpiar búsqueda"
                            )
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            // 3b. Selector de filtros (chips) por prioridad debajo de la búsqueda
            val opcionesFiltro = listOf(
                null to "Todas",
                Prioridad.ALTA to "Altas",
                Prioridad.MEDIA to "Medias",
                Prioridad.BAJA to "Bajas"
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                opcionesFiltro.forEach { (nivel, etiqueta) ->
                    FilterChip(
                        selected = filtroPrioridad == nivel,
                        onClick = { filtroPrioridad = nivel },
                        label = { Text(etiqueta) },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 4. Lista de actividades
            if (actividades.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No hay actividades todavía. Agrega una arriba.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            } else if (actividadesFiltradas.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No se encontraron actividades con \\"$textoBusqueda\\".",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(actividadesFiltradas, key = { it.id }) { actividad ->
                        ActividadItem(
                            actividad = actividad,
                            formatoFecha = formatoFecha,
                            onToggleCompletada = {
                                val index = actividades.indexOfFirst { it.id == actividad.id }
                                if (index != -1) {
                                    actividades[index] = actividad.copy(
                                        completada = !actividad.completada
                                    )
                                }
                            },
                            onEditar = { actividadEnEdicion = actividad },
                            onEliminar = { actividades.removeAll { it.id == actividad.id } }
                        )
                    }
                }
            }
        }
    }

    // Diálogo para elegir la fecha al crear una actividad
    if (mostrarSelectorFecha) {
        val datePickerState = rememberDatePickerState()
        DatePickerDialog(
            onDismissRequest = { mostrarSelectorFecha = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        datePickerState.selectedDateMillis?.let { millis ->
                            fechaSeleccionada = Instant.ofEpochMilli(millis)
                                .atZone(ZoneId.of("UTC"))
                                .toLocalDate()
                        }
                        mostrarSelectorFecha = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarSelectorFecha = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    // Diálogo sencillo para editar nombre y fecha de una actividad existente
    actividadEnEdicion?.let { actividad ->
        DialogoEditarActividad(
            actividad = actividad,
            formatoFecha = formatoFecha,
            onGuardar = { nuevoNombre, nuevaFecha ->
                val index = actividades.indexOfFirst { it.id == actividad.id }
                if (index != -1) {
                    actividades[index] = actividad.copy(
                        nombre = nuevoNombre,
                        fecha = nuevaFecha
                    )
                }
                actividadEnEdicion = null
            },
            onCancelar = { actividadEnEdicion = null }
        )
    }
}

@Composable
fun ResumenProgresoCard(
    total: Int,
    completadas: Int,
    porcentaje: Int
) {
    val todoCompletado = total > 0 && completadas == total
    val colorProgreso = if (todoCompletado) {
        Color(0xFF10B981)
    } else {
        MaterialTheme.colorScheme.primary
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Resumen de progreso",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "$completadas de $total completadas",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(10.dp))
                LinearProgressIndicator(
                    progress = { porcentaje / 100f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = colorProgreso,
                    trackColor = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.2f)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Box(
                modifier = Modifier.size(56.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    progress = { porcentaje / 100f },
                    modifier = Modifier.fillMaxSize(),
                    color = colorProgreso,
                    trackColor = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.2f),
                    strokeWidth = 5.dp
                )
                Text(
                    text = "$porcentaje%",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    color = colorProgreso
                )
            }
        }
    }
}

@Composable
fun ActividadItem(
    actividad: Actividad,
    formatoFecha: DateTimeFormatter,
    onToggleCompletada: () -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = { onToggleCompletada() }
            )

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = actividad.nombre,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    },
                    color = if (actividad.completada) {
                        MaterialTheme.colorScheme.onSurfaceVariant
                    } else {
                        MaterialTheme.colorScheme.onSurface
                    }
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = actividad.fecha.format(formatoFecha),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = " · ",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Icon(
                        imageVector = Icons.Default.Flag,
                        contentDescription = null,
                        tint = actividad.prioridad.color,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = actividad.prioridad.etiqueta,
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold,
                        color = actividad.prioridad.color
                    )
                }
            }

            IconButton(onClick = onEditar) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Editar actividad",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad",
                    tint = Color(0xFFEF4444)
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DialogoEditarActividad(
    actividad: Actividad,
    formatoFecha: DateTimeFormatter,
    onGuardar: (String, LocalDate) -> Unit,
    onCancelar: () -> Unit
) {
    var nombreEditado by remember { mutableStateOf(actividad.nombre) }
    var fechaEditada by remember { mutableStateOf(actividad.fecha) }
    var errorEdicion by remember { mutableStateOf<String?>(null) }
    var mostrarDatePicker by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onCancelar,
        title = { Text("Editar actividad") },
        text = {
            Column {
                OutlinedTextField(
                    value = nombreEditado,
                    onValueChange = {
                        nombreEditado = it
                        if (it.isNotBlank()) errorEdicion = null
                    },
                    label = { Text("Nombre de la actividad") },
                    isError = errorEdicion != null,
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                if (errorEdicion != null) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = errorEdicion!!,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedButton(
                    onClick = { mostrarDatePicker = true },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.CalendarToday,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Fecha: \${fechaEditada.format(formatoFecha)}")
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val limpio = nombreEditado.trim()
                    if (limpio.isEmpty()) {
                        errorEdicion = "El nombre no puede quedar vacío."
                    } else {
                        onGuardar(limpio, fechaEditada)
                    }
                }
            ) {
                Text("Guardar")
            }
        },
        dismissButton = {
            TextButton(onClick = onCancelar) {
                Text("Cancelar")
            }
        }
    )

    if (mostrarDatePicker) {
        val pickerState = rememberDatePickerState(
            initialSelectedDateMillis = fechaEditada
                .atStartOfDay(ZoneId.of("UTC"))
                .toInstant()
                .toEpochMilli()
        )
        DatePickerDialog(
            onDismissRequest = { mostrarDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        pickerState.selectedDateMillis?.let { millis ->
                            fechaEditada = Instant.ofEpochMilli(millis)
                                .atZone(ZoneId.of("UTC"))
                                .toLocalDate()
                        }
                        mostrarDatePicker = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarDatePicker = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            DatePicker(state = pickerState)
        }
    }
}
`;
