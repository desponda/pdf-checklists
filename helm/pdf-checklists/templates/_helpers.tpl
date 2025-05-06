{{/*
Common labels
*/}}
{{- define "pdf-checklists.labels" -}}
app.kubernetes.io/name: pdf-checklists
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
